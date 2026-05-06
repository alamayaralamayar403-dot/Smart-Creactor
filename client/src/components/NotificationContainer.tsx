/**
 * مكون حاوية الإشعارات
 * يعرض جميع الإشعارات النشطة في أسفل يمين الشاشة
 */

import React, { useEffect, useState } from 'react';
import { notificationService, NotificationState } from '@/lib/notificationService';
import NotificationItem from './NotificationItem';

export default function NotificationContainer() {
  const [state, setState] = useState<NotificationState>(
    notificationService.getState()
  );

  useEffect(() => {
    // الاشتراك في تحديثات الإشعارات
    const unsubscribe = notificationService.subscribe((newState) => {
      setState(newState);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <div
      className="fixed bottom-4 right-4 z-50 space-y-3 max-w-md"
      role="region"
      aria-label="إشعارات"
      aria-live="polite"
      aria-atomic="false"
    >
      {state.notifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onClose={() => notificationService.removeNotification(notification.id)}
          onRead={() => notificationService.markAsRead(notification.id)}
        />
      ))}
    </div>
  );
}
