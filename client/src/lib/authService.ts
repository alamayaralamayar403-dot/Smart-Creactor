/**
 * نظام المصادقة المستقل
 * Email/Password بدون الاعتماد على أي خادم خارجي
 */

import { localDB, User } from './localDatabase';
import crypto from 'crypto-js';

interface AuthResponse {
  success: boolean;
  message: string;
  user?: User;
  token?: string;
}

class AuthService {
  private sessionKey = 'smartcreator_session';
  private tokenKey = 'smartcreator_token';

  /**
   * تشفير كلمة المرور
   */
  private hashPassword(password: string): string {
    return crypto.SHA256(password + 'smartcreator_salt').toString();
  }

  /**
   * التحقق من صحة البريد الإلكتروني
   */
  private validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * التحقق من قوة كلمة المرور
   */
  private validatePassword(password: string): { valid: boolean; message?: string } {
    if (password.length < 8) {
      return { valid: false, message: 'كلمة المرور يجب أن تكون 8 أحرف على الأقل' };
    }
    if (!/[A-Z]/.test(password)) {
      return { valid: false, message: 'كلمة المرور يجب أن تحتوي على حرف كبير' };
    }
    if (!/[0-9]/.test(password)) {
      return { valid: false, message: 'كلمة المرور يجب أن تحتوي على رقم' };
    }
    return { valid: true };
  }

  /**
   * إنشاء token جديد
   */
  private generateToken(): string {
    return crypto.lib.WordArray.random(32).toString() || 'token_' + Date.now();
  }

  /**
   * التسجيل (إنشاء حساب جديد)
   */
  async register(email: string, password: string, name: string): Promise<AuthResponse> {
    try {
      // التحقق من صحة البريد الإلكتروني
      if (!this.validateEmail(email)) {
        return { success: false, message: 'البريد الإلكتروني غير صحيح' };
      }

      // التحقق من قوة كلمة المرور
      const passwordValidation = this.validatePassword(password);
      if (!passwordValidation.valid) {
        return { success: false, message: passwordValidation.message || 'كلمة المرور ضعيفة' };
      }

      // التحقق من عدم وجود حساب بنفس البريد
      const existingUser = await localDB.getUserByEmail(email);
      if (existingUser) {
        return { success: false, message: 'هذا البريد الإلكتروني مسجل بالفعل' };
      }

      // إنشاء مستخدم جديد
      const newUser: User = {
        id: 'user_' + Date.now() + '_' + Math.random().toString(36).substring(7),
        email,
        passwordHash: this.hashPassword(password),
        name,
        createdAt: Date.now(),
        lastLogin: Date.now(),
        isActive: true,
      };

      // حفظ المستخدم في قاعدة البيانات
      await localDB.addUser(newUser);

      // إنشاء token
      const token = this.generateToken() || 'token_' + Date.now();
      localStorage.setItem(this.tokenKey, token);
      localStorage.setItem(this.sessionKey, JSON.stringify(newUser));

      return {
        success: true,
        message: 'تم إنشاء الحساب بنجاح',
        user: newUser,
        token,
      };
    } catch (error) {
      return {
        success: false,
        message: `خطأ في التسجيل: ${error instanceof Error ? error.message : 'خطأ غير معروف'}`,
      };
    }
  }

  /**
   * تسجيل الدخول
   */
  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      // التحقق من صحة البريد الإلكتروني
      if (!this.validateEmail(email)) {
        return { success: false, message: 'البريد الإلكتروني غير صحيح' };
      }

      // البحث عن المستخدم
      const user = await localDB.getUserByEmail(email);
      if (!user) {
        return { success: false, message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' };
      }

      // التحقق من كلمة المرور
      const passwordHash = this.hashPassword(password);
      if (passwordHash !== user.passwordHash) {
        return { success: false, message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' };
      }

      // التحقق من أن الحساب نشط
      if (!user.isActive) {
        return { success: false, message: 'هذا الحساب معطل' };
      }

      // تحديث آخر تسجيل دخول
      user.lastLogin = Date.now();
      await localDB.updateUser(user);

      // إنشاء token
      const token = this.generateToken() || 'token_' + Date.now();
      localStorage.setItem(this.tokenKey, token);
      localStorage.setItem(this.sessionKey, JSON.stringify(user));

      return {
        success: true,
        message: 'تم تسجيل الدخول بنجاح',
        user,
        token,
      };
    } catch (error) {
      return {
        success: false,
        message: `خطأ في تسجيل الدخول: ${error instanceof Error ? error.message : 'خطأ غير معروف'}`,
      };
    }
  }

  /**
   * تسجيل الخروج
   */
  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.sessionKey);
  }

  /**
   * الحصول على المستخدم الحالي
   */
  getCurrentUser(): User | null {
    const sessionData = localStorage.getItem(this.sessionKey);
    if (!sessionData) return null;

    try {
      return JSON.parse(sessionData) as User;
    } catch {
      return null;
    }
  }

  /**
   * التحقق من وجود جلسة نشطة
   */
  isAuthenticated(): boolean {
    return !!localStorage.getItem(this.tokenKey) && !!this.getCurrentUser();
  }

  /**
   * تغيير كلمة المرور
   */
  async changePassword(email: string, oldPassword: string, newPassword: string): Promise<AuthResponse> {
    try {
      // البحث عن المستخدم
      const user = await localDB.getUserByEmail(email);
      if (!user) {
        return { success: false, message: 'المستخدم غير موجود' };
      }

      // التحقق من كلمة المرور القديمة
      const oldPasswordHash = this.hashPassword(oldPassword);
      if (oldPasswordHash !== user.passwordHash) {
        return { success: false, message: 'كلمة المرور القديمة غير صحيحة' };
      }

      // التحقق من قوة كلمة المرور الجديدة
      const passwordValidation = this.validatePassword(newPassword);
      if (!passwordValidation.valid) {
        return { success: false, message: passwordValidation.message || 'كلمة المرور ضعيفة' };
      }

      // تحديث كلمة المرور
      user.passwordHash = this.hashPassword(newPassword);
      await localDB.updateUser(user);

      return { success: true, message: 'تم تغيير كلمة المرور بنجاح' };
    } catch (error) {
      return {
        success: false,
        message: `خطأ في تغيير كلمة المرور: ${error instanceof Error ? error.message : 'خطأ غير معروف'}`,
      };
    }
  }

  /**
   * استرجاع كلمة المرور (محاكاة)
   * ملاحظة: في تطبيق حقيقي، يجب إرسال بريد إلكتروني برابط استرجاع
   */
  async resetPassword(email: string): Promise<AuthResponse> {
    try {
      const user = await localDB.getUserByEmail(email);
      if (!user) {
        return { success: false, message: 'البريد الإلكتروني غير موجود' };
      }

      // في تطبيق حقيقي، سيتم إرسال بريد إلكتروني برابط استرجاع
      // هنا نقوم بمحاكاة العملية
      const temporaryPassword = (crypto.lib.WordArray.random(8).toString() || 'temp_' + Date.now()).substring(0, 12);

      return {
        success: true,
        message: `تم إرسال كلمة مرور مؤقتة إلى ${email}. الكلمة المؤقتة: ${temporaryPassword}`,
      };
    } catch (error) {
      return {
        success: false,
        message: `خطأ في استرجاع كلمة المرور: ${error instanceof Error ? error.message : 'خطأ غير معروف'}`,
      };
    }
  }

  /**
   * تحديث بيانات المستخدم
   */
  async updateProfile(userId: string, updates: Partial<User>): Promise<AuthResponse> {
    try {
      const user = await localDB.getUserById(userId);
      if (!user) {
        return { success: false, message: 'المستخدم غير موجود' };
      }

      // تحديث البيانات المسموح بها فقط
      if (updates.name) user.name = updates.name;

      await localDB.updateUser(user);

      // تحديث الجلسة
      localStorage.setItem(this.sessionKey, JSON.stringify(user));

      return { success: true, message: 'تم تحديث البيانات بنجاح', user };
    } catch (error) {
      return {
        success: false,
        message: `خطأ في تحديث البيانات: ${error instanceof Error ? error.message : 'خطأ غير معروف'}`,
      };
    }
  }
}

// إنشاء instance واحد من خدمة المصادقة
export const authService = new AuthService();
