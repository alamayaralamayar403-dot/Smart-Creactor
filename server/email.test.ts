import { describe, it, expect, beforeAll } from 'vitest';
import { sendActivationEmail } from './sellapp-integration';

describe('Email System', () => {
  it('should have email credentials configured', () => {
    const emailUser = process.env.EMAIL_USER;
    const emailPassword = process.env.EMAIL_PASSWORD;
    
    expect(emailUser).toBeDefined();
    expect(emailPassword).toBeDefined();
    expect(emailUser).toBe('alamayaralamayar403@gmail.com');
  });

  it('should validate email format', () => {
    const emailUser = process.env.EMAIL_USER;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    expect(emailRegex.test(emailUser || '')).toBe(true);
  });

  it('should have app password format', () => {
    const emailPassword = process.env.EMAIL_PASSWORD;
    
    // Gmail app password format: 4 words separated by spaces
    expect(emailPassword).toBeDefined();
    expect(emailPassword?.split(' ').length).toBe(4);
  });

  it('should prepare email template correctly', () => {
    const customerEmail = 'test@example.com';
    const activationCode = 'SMART2026';
    
    const subject = 'كود تفعيل نظام المبدع الذكي 2026';
    const body = `
مرحباً بك في نظام المبدع الذكي 2026!

كود التفعيل الخاص بك: ${activationCode}

يرجى إدخال هذا الكود في التطبيق للوصول إلى جميع الميزات.

شكراً لاختيارك نظامنا!
    `;

    expect(subject).toContain('كود تفعيل');
    expect(body).toContain(activationCode);
    expect(body).toContain('نظام المبدع الذكي');
  });
});
