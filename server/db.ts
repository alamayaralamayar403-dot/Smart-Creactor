import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, customers, InsertCustomer, orders, InsertOrder, files, InsertFile, analytics, InsertAnalytics, activationCodes, salesWebhooks, emailLogs } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

/**
 * Customer queries
 */
export async function createCustomer(data: InsertCustomer) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(customers).values(data);
}

export async function getCustomers() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(customers);
}

/**
 * Order queries
 */
export async function createOrder(data: InsertOrder) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(orders).values(data);
}

export async function getOrdersByCustomerId(customerId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(orders).where(eq(orders.customerId, customerId));
}

export async function getOrders() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(orders);
}

/**
 * File queries
 */
export async function createFile(data: InsertFile) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(files).values(data);
}

export async function getFilesByCustomerId(customerId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(files).where(eq(files.customerId, customerId));
}

/**
 * Analytics queries
 */
export async function getAnalyticsByDate(date: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(analytics).where(eq(analytics.date, date)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

/**
 * Activation Code queries
 */
export async function generateActivationCode(data: {
  code: string;
  email: string;
  customerId?: number;
  orderId?: number;
  expiresAt?: Date;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.insert(activationCodes).values({
    code: data.code,
    email: data.email,
    customerId: data.customerId,
    orderId: data.orderId,
    expiresAt: data.expiresAt,
    status: "unused",
  });
  
  const result = await db.select().from(activationCodes).where(eq(activationCodes.code, data.code)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function getActivationCodeByCode(code: string) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(activationCodes).where(eq(activationCodes.code, code)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function updateActivationCodeStatus(code: string, status: string, deviceId?: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const updateData: any = { status, updatedAt: new Date() };
  if (status === "used") {
    updateData.usedAt = new Date();
    if (deviceId) updateData.deviceId = deviceId;
  }
  
  return db.update(activationCodes).set(updateData).where(eq(activationCodes.code, code));
}

export async function getActivationCodesByEmail(email: string) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(activationCodes).where(eq(activationCodes.email, email));
}

/**
 * Sales Webhook queries
 */
export async function createSalesWebhook(data: {
  webhookId: string;
  eventType: string;
  email: string;
  payload: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return db.insert(salesWebhooks).values({
    webhookId: data.webhookId,
    eventType: data.eventType,
    payload: data.payload,
    status: "pending",
  });
}

export async function updateWebhookStatus(webhookId: string, status: string, errorMessage?: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const updateData: any = { status, processedAt: new Date() };
  if (errorMessage) updateData.errorMessage = errorMessage;
  
  return db.update(salesWebhooks).set(updateData).where(eq(salesWebhooks.webhookId, webhookId));
}

/**
 * Email Log queries
 */
export async function logEmail(data: {
  recipientEmail: string;
  subject: string;
  type: "activation_code" | "welcome" | "support" | "notification";
  status?: "sent" | "failed" | "bounced";
  errorMessage?: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return db.insert(emailLogs).values({
    recipientEmail: data.recipientEmail,
    subject: data.subject,
    type: data.type,
    status: data.status || "sent",
    errorMessage: data.errorMessage,
  });
}
