/**
 * Hook مخصص لاستخدام نظام الإشعارات
 * يوفر طرقاً سهلة لإضافة إشعارات من أي مكون
 */

import { notificationService } from '@/lib/notificationService';

export function useNotification() {
  return {
    /**
     * إظهار إشعار نجاح
     * @example
     * notify.success('تم بنجاح', 'تم حفظ البيانات بنجاح')
     */
    success: (title: string, message: string, duration?: number) =>
      notificationService.success(title, message, duration),

    /**
     * إظهار إشعار خطأ
     * @example
     * notify.error('خطأ', 'حدث خطأ أثناء الحفظ')
     */
    error: (title: string, message: string, duration?: number) =>
      notificationService.error(title, message, duration),

    /**
     * إظهار إشعار معلومات
     * @example
     * notify.info('معلومة', 'هذه معلومة مهمة')
     */
    info: (title: string, message: string, duration?: number) =>
      notificationService.info(title, message, duration),

    /**
     * إظهار إشعار تحذير
     * @example
     * notify.warning('تحذير', 'تأكد من البيانات المدخلة')
     */
    warning: (title: string, message: string, duration?: number) =>
      notificationService.warning(title, message, duration),

    /**
     * إضافة إشعار مخصص مع إجراء
     * @example
     * notify.withAction('تم', 'تم حذف العنصر', {
     *   label: 'تراجع',
     *   onClick: () => { console.log('تم التراجع') }
     * })
     */
    withAction: (
      type: 'success' | 'error' | 'info' | 'warning',
      title: string,
      message: string,
      action: { label: string; onClick: () => void },
      duration?: number
    ) =>
      notificationService.addNotification(type, title, message, {
        duration,
        action,
      }),

    /**
     * حذف إشعار معين
     */
    remove: (id: string) => notificationService.removeNotification(id),

    /**
     * حذف جميع الإشعارات
     */
    clearAll: () => notificationService.clearAll(),

    /**
     * حذف الإشعارات المقروءة فقط
     */
    clearRead: () => notificationService.clearRead(),

    /**
     * الحصول على جميع الإشعارات
     */
    getAll: () => notificationService.getNotifications(),

    /**
     * الحصول على الإشعارات غير المقروءة
     */
    getUnread: () => notificationService.getUnreadNotifications(),

    /**
     * الحصول على عدد الإشعارات غير المقروءة
     */
    getUnreadCount: () => notificationService.getUnreadCount(),
  };
}
