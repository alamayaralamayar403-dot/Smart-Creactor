/**
 * نظام إدارة الإشعارات المخصص
 * يوفر إدارة كاملة للإشعارات مع التخزين المحلي والحذف التلقائي
 */

export type NotificationType = 'success' | 'error' | 'info' | 'warning';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  duration?: number; // بالميلي ثانية
  action?: {
    label: string;
    onClick: () => void;
  };
  createdAt: number;
  read: boolean;
}

export interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
}

// نوع للـ Listener
type NotificationListener = (state: NotificationState) => void;

class NotificationService {
  private notifications: Map<string, Notification> = new Map();
  private listeners: Set<NotificationListener> = new Set();
  private readonly STORAGE_KEY = 'smart-creator-notifications';
  private readonly MAX_NOTIFICATIONS = 50;
  private timeouts: Map<string, NodeJS.Timeout> = new Map();

  constructor() {
    this.loadFromStorage();
  }

  /**
   * إضافة إشعار جديد
   */
  addNotification(
    type: NotificationType,
    title: string,
    message: string,
    options?: {
      duration?: number;
      action?: { label: string; onClick: () => void };
    }
  ): string {
    const id = this.generateId();
    const notification: Notification = {
      id,
      type,
      title,
      message,
      duration: options?.duration ?? this.getDefaultDuration(type),
      action: options?.action,
      createdAt: Date.now(),
      read: false,
    };

    this.notifications.set(id, notification);
    this.saveToStorage();
    this.notifyListeners();

    // حذف تلقائي بعد المدة المحددة
    if (notification.duration && notification.duration > 0) {
      const timeout = setTimeout(() => {
        this.removeNotification(id);
      }, notification.duration);
      this.timeouts.set(id, timeout);
    }

    return id;
  }

  /**
   * إضافة إشعار نجاح
   */
  success(title: string, message: string, duration?: number): string {
    return this.addNotification('success', title, message, { duration });
  }

  /**
   * إضافة إشعار خطأ
   */
  error(title: string, message: string, duration?: number): string {
    return this.addNotification('error', title, message, { duration });
  }

  /**
   * إضافة إشعار معلومات
   */
  info(title: string, message: string, duration?: number): string {
    return this.addNotification('info', title, message, { duration });
  }

  /**
   * إضافة إشعار تحذير
   */
  warning(title: string, message: string, duration?: number): string {
    return this.addNotification('warning', title, message, { duration });
  }

  /**
   * حذف إشعار
   */
  removeNotification(id: string): void {
    this.notifications.delete(id);
    
    // إلغاء المؤقت إن وجد
    const timeout = this.timeouts.get(id);
    if (timeout) {
      clearTimeout(timeout);
      this.timeouts.delete(id);
    }

    this.saveToStorage();
    this.notifyListeners();
  }

  /**
   * تحديد الإشعار كمقروء
   */
  markAsRead(id: string): void {
    const notification = this.notifications.get(id);
    if (notification) {
      notification.read = true;
      this.saveToStorage();
      this.notifyListeners();
    }
  }

  /**
   * تحديد جميع الإشعارات كمقروءة
   */
  markAllAsRead(): void {
    this.notifications.forEach((notification) => {
      notification.read = true;
    });
    this.saveToStorage();
    this.notifyListeners();
  }

  /**
   * الحصول على جميع الإشعارات
   */
  getNotifications(): Notification[] {
    return Array.from(this.notifications.values()).sort(
      (a, b) => b.createdAt - a.createdAt
    );
  }

  /**
   * الحصول على الإشعارات غير المقروءة
   */
  getUnreadNotifications(): Notification[] {
    return this.getNotifications().filter((n) => !n.read);
  }

  /**
   * الحصول على عدد الإشعارات غير المقروءة
   */
  getUnreadCount(): number {
    return this.getUnreadNotifications().length;
  }

  /**
   * حذف جميع الإشعارات
   */
  clearAll(): void {
    this.notifications.clear();
    this.timeouts.forEach((timeout) => clearTimeout(timeout));
    this.timeouts.clear();
    this.saveToStorage();
    this.notifyListeners();
  }

  /**
   * حذف الإشعارات المقروءة
   */
  clearRead(): void {
    Array.from(this.notifications.entries()).forEach(([id, notification]) => {
      if (notification.read) {
        this.removeNotification(id);
      }
    });
  }

  /**
   * الاشتراك في تحديثات الإشعارات
   */
  subscribe(listener: NotificationListener): () => void {
    this.listeners.add(listener);
    // إرسال الحالة الحالية فوراً
    listener(this.getState());
    
    // إرجاع دالة لإلغاء الاشتراك
    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * الحصول على الحالة الحالية
   */
  getState(): NotificationState {
    return {
      notifications: this.getNotifications(),
      unreadCount: this.getUnreadCount(),
    };
  }

  /**
   * حفظ الإشعارات في التخزين المحلي
   */
  private saveToStorage(): void {
    try {
      const data = Array.from(this.notifications.values());
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save notifications to storage:', error);
    }
  }

  /**
   * تحميل الإشعارات من التخزين المحلي
   */
  private loadFromStorage(): void {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      if (data) {
        const notifications = JSON.parse(data) as Notification[];
        notifications.forEach((notification) => {
          // تحميل الإشعارات القديمة فقط (أقل من 24 ساعة)
          if (Date.now() - notification.createdAt < 24 * 60 * 60 * 1000) {
            this.notifications.set(notification.id, notification);
          }
        });
      }
    } catch (error) {
      console.error('Failed to load notifications from storage:', error);
    }
  }

  /**
   * إخطار المستمعين بالتحديثات
   */
  private notifyListeners(): void {
    const state = this.getState();
    this.listeners.forEach((listener) => {
      try {
        listener(state);
      } catch (error) {
        console.error('Error in notification listener:', error);
      }
    });
  }

  /**
   * توليد معرف فريد
   */
  private generateId(): string {
    return `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * الحصول على المدة الافتراضية حسب النوع
   */
  private getDefaultDuration(type: NotificationType): number {
    const durations: Record<NotificationType, number> = {
      success: 4000,
      error: 6000,
      info: 4000,
      warning: 5000,
    };
    return durations[type];
  }

  /**
   * تنظيف الإشعارات القديمة (أكثر من 50 إشعار)
   */
  private cleanup(): void {
    if (this.notifications.size > this.MAX_NOTIFICATIONS) {
      const sorted = this.getNotifications();
      const toRemove = sorted.slice(this.MAX_NOTIFICATIONS);
      toRemove.forEach((notification) => {
        this.removeNotification(notification.id);
      });
    }
  }
}

// إنشاء instance واحد من الخدمة (Singleton)
export const notificationService = new NotificationService();
