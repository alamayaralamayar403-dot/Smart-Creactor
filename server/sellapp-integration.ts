/**
 * Sell App Integration Module
 * Handles webhook processing, code generation, and email notifications
 * Author: عمر المقطري
 */

import { generateActivationCode, createCustomer, createOrder, logEmail, updateWebhookStatus, createSalesWebhook } from "./db";
import { sendActivationEmail } from "./_core/email";
import crypto from "crypto";

/**
 * Generate a unique activation code
 */
export function generateUniqueCode(): string {
  // Format: SMART-XXXX-XXXX-XXXX (16 characters + 3 dashes)
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "SMART";
  
  for (let i = 0; i < 3; i++) {
    code += "-";
    for (let j = 0; j < 4; j++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
  }
  
  return code;
}

/**
 * Process webhook from Sell App
 * Expected payload structure:
 * {
 *   event: "sale.completed",
 *   order_id: "12345",
 *   customer: {
 *     email: "customer@example.com",
 *     name: "Customer Name"
 *   },
 *   product: {
 *     name: "Smart Creator 2026",
 *     price: 29.99
 *   },
 *   transaction_id: "txn_123456"
 * }
 */
export async function processSellAppWebhook(payload: any) {
  try {
    const webhookId = crypto.randomUUID();
    
    // Log webhook receipt
    await createSalesWebhook({
      webhookId,
      eventType: payload.event || "sale.completed",
      email: payload.customer?.email || "",
      payload: JSON.stringify(payload),
    });

    // Only process completed sales
    if (payload.event !== "sale.completed") {
      await updateWebhookStatus(webhookId, "processed");
      return { success: true, message: "Event type not processed" };
    }

    const { customer, product, transaction_id } = payload;

    if (!customer?.email || !customer?.name) {
      throw new Error("Missing customer information");
    }

    // Step 1: Create or update customer
    let customerId: number | undefined;
    try {
      const result = await createCustomer({
        email: customer.email,
        name: customer.name,
        phone: customer.phone,
        country: customer.country,
        status: "active",
      });
      
      // Get the inserted customer ID
      customerId = (result as any).insertId || 1;
    } catch (error) {
      console.warn("Customer creation warning:", error);
      // Continue even if customer creation fails (might already exist)
    }

    // Step 2: Create order record
    let orderId: number | undefined;
    try {
      const result = await createOrder({
        customerId: customerId || 1,
        productName: product?.name || "Smart Creator 2026",
        productPrice: Math.round((product?.price || 29.99) * 100),
        quantity: 1,
        totalAmount: Math.round((product?.price || 29.99) * 100),
        paymentStatus: "completed",
        paymentMethod: "sell_app",
        transactionId: transaction_id,
      });
      
      orderId = (result as any).insertId;
    } catch (error) {
      console.warn("Order creation warning:", error);
    }

    // Step 3: Generate activation code
    const activationCode = generateUniqueCode();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 365); // Valid for 1 year

    await generateActivationCode({
      code: activationCode,
      email: customer.email,
      customerId,
      orderId,
      expiresAt,
    });

    // Step 4: Send activation email
    try {
      await sendActivationEmail({
        email: customer.email,
        name: customer.name,
        code: activationCode,
        appUrl: "https://tiny-queijadas-60d111.netlify.app",
      });

      await logEmail({
        recipientEmail: customer.email,
        subject: "كود تفعيل نظام المبدع الذكي 2026",
        type: "activation_code",
        status: "sent",
      });
    } catch (emailError) {
      console.error("Email sending error:", emailError);
      await logEmail({
        recipientEmail: customer.email,
        subject: "كود تفعيل نظام المبدع الذكي 2026",
        type: "activation_code",
        status: "failed",
        errorMessage: String(emailError),
      });
    }

    // Step 5: Mark webhook as processed
    await updateWebhookStatus(webhookId, "processed");

    return {
      success: true,
      message: "Webhook processed successfully",
      activationCode,
      customerId,
      orderId,
    };
  } catch (error) {
    console.error("Webhook processing error:", error);
    throw error;
  }
}

/**
 * Verify activation code
 */
export async function verifyActivationCode(code: string) {
  try {
    const codeRecord = await getActivationCodeByCode(code);

    if (!codeRecord) {
      return { valid: false, message: "الكود غير صحيح" };
    }

    if (codeRecord.status === "used") {
      return { valid: false, message: "الكود مستخدم بالفعل" };
    }

    if (codeRecord.status === "expired" || codeRecord.status === "revoked") {
      return { valid: false, message: "الكود منتهي الصلاحية" };
    }

    if (codeRecord.expiresAt && new Date() > codeRecord.expiresAt) {
      return { valid: false, message: "الكود منتهي الصلاحية" };
    }

    return { valid: true, message: "الكود صحيح", code: codeRecord };
  } catch (error) {
    console.error("Code verification error:", error);
    return { valid: false, message: "خطأ في التحقق من الكود" };
  }
}

// Import the function we need
import { getActivationCodeByCode } from "./db";
