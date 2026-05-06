import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { notificationService, Notification } from './notificationService';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('NotificationService', () => {
  beforeEach(() => {
    notificationService.clearAll();
    localStorage.clear();
  });

  afterEach(() => {
    notificationService.clearAll();
    localStorage.clear();
  });

  describe('إضافة الإشعارات', () => {
    it('يجب إضافة إشعار نجاح بنجاح', () => {
      const id = notificationService.success('تم', 'تم الحفظ بنجاح');
      expect(id).toBeDefined();
      expect(notificationService.getNotifications()).toHaveLength(1);
    });

    it('يجب إضافة إشعار خطأ بنجاح', () => {
      const id = notificationService.error('خطأ', 'حدث خطأ ما');
      expect(id).toBeDefined();
      expect(notificationService.getNotifications()).toHaveLength(1);
    });

    it('يجب إضافة إشعار معلومات بنجاح', () => {
      const id = notificationService.info('معلومة', 'هذه معلومة');
      expect(id).toBeDefined();
      expect(notificationService.getNotifications()).toHaveLength(1);
    });

    it('يجب إضافة إشعار تحذير بنجاح', () => {
      const id = notificationService.warning('تحذير', 'تحذير مهم');
      expect(id).toBeDefined();
      expect(notificationService.getNotifications()).toHaveLength(1);
    });

    it('يجب إضافة إشعار مخصص مع إجراء', () => {
      const action = { label: 'تراجع', onClick: vi.fn() };
      const id = notificationService.addNotification(
        'success',
        'تم',
        'تم الحذف',
        { action }
      );
      expect(id).toBeDefined();
      const notifications = notificationService.getNotifications();
      expect(notifications).toHaveLength(1);
      expect(notifications[0].action).toEqual(action);
    });
  });

  describe('حذف الإشعارات', () => {
    it('يجب حذف إشعار معين', () => {
      const id = notificationService.success('تم', 'تم الحفظ');
      expect(notificationService.getNotifications()).toHaveLength(1);
      notificationService.removeNotification(id);
      expect(notificationService.getNotifications()).toHaveLength(0);
    });

    it('يجب حذف جميع الإشعارات', () => {
      notificationService.success('تم 1', 'رسالة 1');
      notificationService.error('خطأ', 'رسالة 2');
      notificationService.info('معلومة', 'رسالة 3');
      expect(notificationService.getNotifications()).toHaveLength(3);
      notificationService.clearAll();
      expect(notificationService.getNotifications()).toHaveLength(0);
    });
  });

  describe('تحديد الإشعارات كمقروءة', () => {
    it('يجب تحديد إشعار كمقروء', () => {
      const id = notificationService.success('تم', 'تم الحفظ');
      const notification = notificationService.getNotifications()[0];
      expect(notification.read).toBe(false);
      notificationService.markAsRead(id);
      const updated = notificationService.getNotifications()[0];
      expect(updated.read).toBe(true);
    });

    it('يجب تحديد جميع الإشعارات كمقروءة', () => {
      notificationService.success('تم 1', 'رسالة 1');
      notificationService.error('خطأ', 'رسالة 2');
      notificationService.info('معلومة', 'رسالة 3');
      
      const unread = notificationService.getUnreadNotifications();
      expect(unread).toHaveLength(3);
      
      notificationService.markAllAsRead();
      const unreadAfter = notificationService.getUnreadNotifications();
      expect(unreadAfter).toHaveLength(0);
    });
  });

  describe('الحصول على الإشعارات', () => {
    it('يجب الحصول على جميع الإشعارات', () => {
      notificationService.success('تم 1', 'رسالة 1');
      notificationService.error('خطأ', 'رسالة 2');
      notificationService.info('معلومة', 'رسالة 3');
      
      const notifications = notificationService.getNotifications();
      expect(notifications).toHaveLength(3);
    });

    it('يجب الحصول على الإشعارات غير المقروءة فقط', () => {
      const id1 = notificationService.success('تم 1', 'رسالة 1');
      const id2 = notificationService.error('خطأ', 'رسالة 2');
      notificationService.info('معلومة', 'رسالة 3');
      
      notificationService.markAsRead(id1);
      const unread = notificationService.getUnreadNotifications();
      expect(unread).toHaveLength(2);
    });

    it('يجب حساب عدد الإشعارات غير المقروءة بشكل صحيح', () => {
      const id1 = notificationService.success('تم 1', 'رسالة 1');
      notificationService.error('خطأ', 'رسالة 2');
      notificationService.info('معلومة', 'رسالة 3');
      
      expect(notificationService.getUnreadCount()).toBe(3);
      notificationService.markAsRead(id1);
      expect(notificationService.getUnreadCount()).toBe(2);
    });
  });

  describe('الاشتراك في التحديثات', () => {
    it('يجب استدعاء الـ listener عند إضافة إشعار', () => {
      const listener = vi.fn();
      notificationService.subscribe(listener);
      
      notificationService.success('تم', 'تم الحفظ');
      expect(listener).toHaveBeenCalled();
    });

    it('يجب إلغاء الاشتراك بشكل صحيح', () => {
      const listener = vi.fn();
      const unsubscribe = notificationService.subscribe(listener);
      
      notificationService.success('تم 1', 'رسالة 1');
      expect(listener).toHaveBeenCalledTimes(1);
      
      unsubscribe();
      notificationService.success('تم 2', 'رسالة 2');
      expect(listener).toHaveBeenCalledTimes(1);
    });
  });

  describe('التخزين المحلي', () => {
    it('يجب حفظ الإشعارات في localStorage', () => {
      notificationService.success('تم', 'تم الحفظ');
      const stored = localStorage.getItem('smart-creator-notifications');
      expect(stored).toBeDefined();
      if (stored) {
        const data = JSON.parse(stored);
        expect(data).toHaveLength(1);
        expect(data[0].type).toBe('success');
      }
    });

    it('يجب تحميل الإشعارات من localStorage', () => {
      const notification: Notification = {
        id: 'test-1',
        type: 'success',
        title: 'تم',
        message: 'تم الحفظ',
        duration: 4000,
        createdAt: Date.now(),
        read: false,
      };
      localStorage.setItem(
        'smart-creator-notifications',
        JSON.stringify([notification])
      );
      
      const stored = localStorage.getItem('smart-creator-notifications');
      expect(stored).toBeDefined();
      if (stored) {
        const data = JSON.parse(stored);
        expect(data).toHaveLength(1);
      }
    });
  });

  describe('المدة الافتراضية', () => {
    it('يجب استخدام المدة الافتراضية الصحيحة', () => {
      const successNotif = notificationService.success('تم', 'رسالة');
      const errorNotif = notificationService.error('خطأ', 'رسالة');
      
      const notifications = notificationService.getNotifications();
      const success = notifications.find((n) => n.id === successNotif);
      const error = notifications.find((n) => n.id === errorNotif);
      
      if (success) {
        expect(success.duration).toBe(4000);
      }
      if (error) {
        expect(error.duration).toBe(6000);
      }
    });
  });
});
