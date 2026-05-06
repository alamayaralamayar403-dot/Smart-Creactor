/**
 * نظام الترخيص والتفعيل
 * يدير أكواز التفعيل والاشتراكات محلياً
 * Author: عمر المقطري
 */

import CryptoJS from 'crypto-js';

export interface LicenseKey {
  code: string;
  email: string;
  activatedAt: number;
  expiresAt: number;
  isActive: boolean;
  features: string[];
}

class LicenseService {
  private readonly STORAGE_KEY = 'app_license_key';
  private readonly ENCRYPTION_KEY = 'smart-creator-2026-license';

  /**
   * توليد كود ترخيص جديد (للاختبار)
   */
  generateLicenseCode(): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 15);
    const code = `SC-${timestamp}-${random}`.toUpperCase();
    return code;
  }

  /**
   * التحقق من صحة كود الترخيص
   */
  validateLicense(code: string): boolean {
    // التحقق من صيغة الكود
    if (!code.startsWith('SC-')) {
      return false;
    }

    // التحقق من طول الكود
    if (code.length < 20) {
      return false;
    }

    return true;
  }

  /**
   * تفعيل كود ترخيص
   */
  async activateLicense(code: string, email: string): Promise<LicenseKey | null> {
    // التحقق من صحة الكود
    if (!this.validateLicense(code)) {
      console.error('[LicenseService] كود ترخيص غير صحيح');
      return null;
    }

    // إنشاء مفتاح الترخيص
    const licenseKey: LicenseKey = {
      code,
      email,
      activatedAt: Date.now(),
      expiresAt: Date.now() + 365 * 24 * 60 * 60 * 1000, // سنة واحدة
      isActive: true,
      features: [
        'prompt-library',
        'idea-generator',
        'notion-template',
        'resources',
        'auto-sync',
        'offline-mode',
      ],
    };

    // حفظ الترخيص
    this.saveLicense(licenseKey);

    console.log('[LicenseService] تم تفعيل الترخيص بنجاح');
    return licenseKey;
  }

  /**
   * حفظ مفتاح الترخيص محلياً
   */
  private saveLicense(license: LicenseKey): void {
    try {
      const encrypted = CryptoJS.AES.encrypt(
        JSON.stringify(license),
        this.ENCRYPTION_KEY
      ).toString();

      localStorage.setItem(this.STORAGE_KEY, encrypted);
    } catch (error) {
      console.error('[LicenseService] خطأ في حفظ الترخيص:', error);
    }
  }

  /**
   * الحصول على مفتاح الترخيص المحفوظ
   */
  getLicense(): LicenseKey | null {
    try {
      const encrypted = localStorage.getItem(this.STORAGE_KEY);

      if (!encrypted) {
        return null;
      }

      const decrypted = CryptoJS.AES.decrypt(encrypted, this.ENCRYPTION_KEY).toString(
        CryptoJS.enc.Utf8
      );

      const license = JSON.parse(decrypted) as LicenseKey;

      // التحقق من انتهاء الصلاحية
      if (license.expiresAt < Date.now()) {
        this.removeLicense();
        return null;
      }

      return license;
    } catch (error) {
      console.error('[LicenseService] خطأ في قراءة الترخيص:', error);
      return null;
    }
  }

  /**
   * التحقق من وجود ترخيص نشط
   */
  isLicenseActive(): boolean {
    const license = this.getLicense();
    return license !== null && license.isActive;
  }

  /**
   * التحقق من وجود ميزة معينة
   */
  hasFeature(feature: string): boolean {
    const license = this.getLicense();
    if (!license) {
      return false;
    }

    return license.features.includes(feature);
  }

  /**
   * الحصول على معلومات الترخيص
   */
  getLicenseInfo(): {
    isActive: boolean;
    email: string;
    daysRemaining: number;
    features: string[];
  } | null {
    const license = this.getLicense();

    if (!license) {
      return null;
    }

    const daysRemaining = Math.ceil((license.expiresAt - Date.now()) / (24 * 60 * 60 * 1000));

    return {
      isActive: license.isActive,
      email: license.email,
      daysRemaining,
      features: license.features,
    };
  }

  /**
   * إزالة الترخيص
   */
  removeLicense(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    console.log('[LicenseService] تم إزالة الترخيص');
  }

  /**
   * تجديد الترخيص
   */
  renewLicense(code: string): boolean {
    const license = this.getLicense();

    if (!license) {
      return false;
    }

    if (!this.validateLicense(code)) {
      return false;
    }

    // تجديد الترخيص
    license.expiresAt = Date.now() + 365 * 24 * 60 * 60 * 1000;
    license.code = code;

    this.saveLicense(license);

    console.log('[LicenseService] تم تجديد الترخيص بنجاح');
    return true;
  }

  /**
   * الحصول على أكواز الاختبار (للتطوير)
   */
  getTestCodes(): string[] {
    return [
      'SC-TEST-001-DEMO-2026',
      'SC-TEST-002-DEMO-2026',
      'SC-TEST-003-DEMO-2026',
      'SC-TEST-004-DEMO-2026',
      'SC-TEST-005-DEMO-2026',
    ];
  }
}

export const licenseService = new LicenseService();
