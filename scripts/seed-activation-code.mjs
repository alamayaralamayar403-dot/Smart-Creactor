#!/usr/bin/env node

import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

// تحميل متغيرات البيئة
dotenv.config();

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('❌ خطأ: DATABASE_URL غير موجود في متغيرات البيئة');
  process.exit(1);
}

async function seedActivationCode() {
  let connection;
  try {
    console.log('🔗 جاري الاتصال بقاعدة البيانات...');

    // تحليل DATABASE_URL
    const url = new URL(DATABASE_URL);
    
    connection = await mysql.createConnection({
      host: url.hostname,
      user: url.username,
      password: url.password,
      database: url.pathname.slice(1),
      ssl: 'require',
    });

    console.log('✅ تم الاتصال بقاعدة البيانات بنجاح');

    // التحقق من وجود الكود بالفعل
    const [existingCode] = await connection.execute(
      'SELECT id FROM activationCodes WHERE code = ?',
      ['SMART2026']
    );

    if (existingCode.length > 0) {
      console.log('⚠️  الكود SMART2026 موجود بالفعل في قاعدة البيانات');
      await connection.end();
      return;
    }

    // إضافة الكود الجديد
    const expiresAt = new Date();
    expiresAt.setFullYear(expiresAt.getFullYear() + 1); // صلاحية سنة واحدة

    await connection.execute(
      `INSERT INTO activationCodes (code, email, status, expiresAt, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, NOW(), NOW())`,
      ['SMART2026', 'test@smartcreator.com', 'unused', expiresAt]
    );

    console.log('✅ تم إضافة كود التفعيل SMART2026 بنجاح!');
    console.log('📋 التفاصيل:');
    console.log('   - الكود: SMART2026');
    console.log('   - البريد: test@smartcreator.com');
    console.log('   - الحالة: unused');
    console.log(`   - تاريخ انتهاء الصلاحية: ${expiresAt.toISOString()}`);

    await connection.end();
  } catch (error) {
    console.error('❌ خطأ:', error.message);
    process.exit(1);
  }
}

seedActivationCode();
