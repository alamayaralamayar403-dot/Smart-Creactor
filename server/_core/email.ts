/**
 * Email Service
 * Handles email sending for activation codes and notifications
 * Author: عمر المقطري
 */

import nodemailer from "nodemailer";

// Email configuration
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER || "alamavaralamavar403@gmail.com",
    pass: process.env.EMAIL_PASSWORD || "", // Use app-specific password
  },
});

/**
 * Send activation code email
 */
export async function sendActivationEmail({
  email,
  name,
  code,
  appUrl,
}: {
  email: string;
  name: string;
  code: string;
  appUrl: string;
}) {
  const htmlContent = `
    <!DOCTYPE html>
    <html dir="rtl" lang="ar">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5; }
        .container { max-width: 600px; margin: 0 auto; background-color: white; padding: 40px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
        .header { text-align: center; margin-bottom: 30px; }
        .logo { font-size: 28px; font-weight: bold; color: #6366f1; margin-bottom: 10px; }
        .title { font-size: 24px; color: #333; margin-bottom: 20px; }
        .content { font-size: 16px; color: #555; line-height: 1.6; margin-bottom: 30px; }
        .code-box { background-color: #f0f4ff; border: 2px solid #6366f1; border-radius: 8px; padding: 20px; text-align: center; margin: 30px 0; }
        .code { font-size: 32px; font-weight: bold; color: #6366f1; letter-spacing: 2px; font-family: 'Courier New', monospace; }
        .code-label { font-size: 12px; color: #999; margin-top: 10px; }
        .button { display: inline-block; background-color: #6366f1; color: white; padding: 12px 30px; border-radius: 6px; text-decoration: none; margin: 20px 0; font-weight: bold; }
        .footer { text-align: center; font-size: 12px; color: #999; margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px; }
        .warning { background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 4px; font-size: 14px; color: #856404; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <div class="logo">🧠⚡</div>
          <div class="title">نظام المبدع الذكي 2026</div>
        </div>

        <div class="content">
          <p>مرحباً ${name},</p>
          <p>شكراً لك على شراء <strong>نظام المبدع الذكي 2026</strong>!</p>
          <p>نحن سعداء بانضمامك إلى مجتمعنا. أنت الآن على بعد خطوة واحدة من الوصول إلى جميع الميزات الاحترافية.</p>
        </div>

        <div class="code-box">
          <div class="code-label">كود التفعيل الخاص بك:</div>
          <div class="code">${code}</div>
        </div>

        <div class="content">
          <p><strong>كيفية استخدام الكود:</strong></p>
          <ol>
            <li>افتح التطبيق من الرابط أدناه</li>
            <li>انسخ الكود أعلاه</li>
            <li>الصقه في حقل "كود التفعيل"</li>
            <li>اضغط "تفعيل التطبيق"</li>
          </ol>
        </div>

        <center>
          <a href="${appUrl}" class="button">فتح التطبيق</a>
        </center>

        <div class="warning">
          <strong>⚠️ ملاحظة مهمة:</strong> هذا الكود صالح لجهاز واحد فقط. لا تشاركه مع أحد آخر.
        </div>

        <div class="content">
          <p><strong>ما الذي ستحصل عليه:</strong></p>
          <ul>
            <li>✅ مكتبة 200+ أمر ذكي</li>
            <li>✅ دليل استراتيجي شامل (50+ صفحة)</li>
            <li>✅ قالب Notion احترافي</li>
            <li>✅ دليل استخدام سريع</li>
            <li>✅ تحديثات مستقبلية مجاناً</li>
          </ul>
        </div>

        <div class="content">
          <p>إذا واجهت أي مشاكل أو لديك أسئلة، لا تتردد في التواصل معنا.</p>
          <p>نتمنى لك النجاح والإنتاجية العالية! 🚀</p>
        </div>

        <div class="footer">
          <p>© 2026 نظام المبدع الذكي - جميع الحقوق محفوظة</p>
          <p>المؤلف: عمر المقطري</p>
          <p>هذا البريد الإلكتروني مرسل تلقائياً، يرجى عدم الرد عليه</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const mailOptions = {
    from: process.env.EMAIL_USER || "alamavaralamavar403@gmail.com",
    to: email,
    subject: "كود تفعيل نظام المبدع الذكي 2026 ✨",
    html: htmlContent,
  };

  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (error: any, info: any) => {
      if (error) {
        console.error("Email sending error:", error);
        reject(error);
      } else {
        console.log("Email sent successfully:", info.response);
        resolve(info);
      }
    });
  });
}

/**
 * Send welcome email
 */
export async function sendWelcomeEmail({
  email,
  name,
}: {
  email: string;
  name: string;
}) {
  const htmlContent = `
    <!DOCTYPE html>
    <html dir="rtl" lang="ar">
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; }
        .container { max-width: 600px; margin: 0 auto; background-color: white; padding: 40px; }
      </style>
    </head>
    <body>
      <div class="container">
        <h2>مرحباً ${name}! 👋</h2>
        <p>شكراً لتفعيلك نظام المبدع الذكي 2026.</p>
        <p>يمكنك الآن الوصول إلى جميع الميزات الاحترافية.</p>
      </div>
    </body>
    </html>
  `;

  const mailOptions = {
    from: process.env.EMAIL_USER || "alamavaralamavar403@gmail.com",
    to: email,
    subject: "مرحباً بك في نظام المبدع الذكي 2026!",
    html: htmlContent,
  };

  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (error: any, info: any) => {
      if (error) {
        reject(error);
      } else {
        resolve(info);
      }
    });
  });
}

/**
 * Send support email
 */
export async function sendSupportEmail({
  email,
  subject,
  message,
}: {
  email: string;
  subject: string;
  message: string;
}) {
  const mailOptions = {
    from: process.env.EMAIL_USER || "alamavaralamavar403@gmail.com",
    to: email,
    subject,
    text: message,
  };

  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (error: any, info: any) => {
      if (error) {
        reject(error);
      } else {
        resolve(info);
      }
    });
  });
}
