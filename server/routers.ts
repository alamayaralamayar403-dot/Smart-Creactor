import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { createCustomer, getCustomers, createOrder, getOrders, getOrdersByCustomerId, createFile, getFilesByCustomerId, getAnalyticsByDate, getActivationCodeByCode, updateActivationCodeStatus, getActivationCodesByEmail } from "./db";
import { z } from "zod";
import { storagePut } from "./storage";
import { processSellAppWebhook } from "./sellapp-integration";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Customers management
  customers: router({
    list: protectedProcedure.query(() => getCustomers()),
    create: protectedProcedure.input(z.object({
      email: z.string().email(),
      name: z.string(),
      phone: z.string().optional(),
      country: z.string().optional(),
    })).mutation(async ({ input }) => {
      return createCustomer({
        email: input.email,
        name: input.name,
        phone: input.phone,
        country: input.country,
      });
    }),
  }),

  // Orders/Sales management
  orders: router({
    list: protectedProcedure.query(() => getOrders()),
    getByCustomer: protectedProcedure.input(z.number()).query(({ input }) => 
      getOrdersByCustomerId(input)
    ),
    create: protectedProcedure.input(z.object({
      customerId: z.number(),
      productName: z.string(),
      productPrice: z.number(),
      quantity: z.number().optional(),
      totalAmount: z.number(),
      paymentMethod: z.string().optional(),
    })).mutation(async ({ input }) => {
      return createOrder({
        customerId: input.customerId,
        productName: input.productName,
        productPrice: input.productPrice,
        quantity: input.quantity || 1,
        totalAmount: input.totalAmount,
        paymentMethod: input.paymentMethod,
        paymentStatus: 'pending',
      });
    }),
  }),

  // Files management
  files: router({
    getByCustomer: protectedProcedure.input(z.number()).query(({ input }) => 
      getFilesByCustomerId(input)
    ),
  }),

  // Analytics
  analytics: router({
    getByDate: protectedProcedure.input(z.string()).query(({ input }) => 
      getAnalyticsByDate(input)
    ),
  }),

  // Activation Codes
  codes: router({
    verify: publicProcedure.input(z.object({
      code: z.string(),
      deviceId: z.string().optional(),
    })).mutation(async ({ input }) => {
      const codeRecord = await getActivationCodeByCode(input.code);
      
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

      // Mark code as used
      await updateActivationCodeStatus(input.code, "used", input.deviceId);

      return { valid: true, message: "الكود صحيح" };
    }),
    
    getByEmail: protectedProcedure.input(z.string().email()).query(({ input }) => 
      getActivationCodesByEmail(input)
    ),
  }),

  // Webhooks
  webhooks: router({
    sellapp: publicProcedure.input(z.any()).mutation(async ({ input }) => {
      try {
        const result = await processSellAppWebhook(input);
        return result;
      } catch (error) {
        console.error("Webhook error:", error);
        return { success: false, error: String(error) };
      }
    }),
  }),
});

export type AppRouter = typeof appRouter;
