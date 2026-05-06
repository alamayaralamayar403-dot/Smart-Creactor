/**
 * مكون عنصر الإشعار الفردي
 * يعرض إشعار واحد مع الرموز والألوان المناسبة
 */

import React, { useEffect, useState } from 'react';
import { Notification } from '@/lib/notificationService';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NotificationItemProps {
  notification: Notification;
  onClose: () => void;
  onRead: () => void;
}

export default function NotificationItem({
  notification,
  onClose,
  onRead,
}: NotificationItemProps) {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // تحديد الإشعار كمقروء عند الظهور
    if (!notification.read) {
      onRead();
    }
  }, [notification.id, notification.read, onRead]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(onClose, 300); // انتظر انتهاء الرسوم المتحركة
  };

  // تحديد الرمز واللون حسب نوع الإشعار
  const getIconAndColors = () => {
    switch (notification.type) {
      case 'success':
        return {
          icon: <CheckCircle className="w-5 h-5" />,
          bgColor: 'bg-green-50 dark:bg-green-950',
          borderColor: 'border-green-200 dark:border-green-800',
          textColor: 'text-green-900 dark:text-green-100',
          iconColor: 'text-green-600 dark:text-green-400',
        };
      case 'error':
        return {
          icon: <AlertCircle className="w-5 h-5" />,
          bgColor: 'bg-red-50 dark:bg-red-950',
          borderColor: 'border-red-200 dark:border-red-800',
          textColor: 'text-red-900 dark:text-red-100',
          iconColor: 'text-red-600 dark:text-red-400',
        };
      case 'warning':
        return {
          icon: <AlertTriangle className="w-5 h-5" />,
          bgColor: 'bg-yellow-50 dark:bg-yellow-950',
          borderColor: 'border-yellow-200 dark:border-yellow-800',
          textColor: 'text-yellow-900 dark:text-yellow-100',
          iconColor: 'text-yellow-600 dark:text-yellow-400',
        };
      case 'info':
      default:
        return {
          icon: <Info className="w-5 h-5" />,
          bgColor: 'bg-blue-50 dark:bg-blue-950',
          borderColor: 'border-blue-200 dark:border-blue-800',
          textColor: 'text-blue-900 dark:text-blue-100',
          iconColor: 'text-blue-600 dark:text-blue-400',
        };
    }
  };

  const { icon, bgColor, borderColor, textColor, iconColor } =
    getIconAndColors();

  return (
    <div
      className={`
        transform transition-all duration-300 ease-out
        ${
          isExiting
            ? 'translate-x-full opacity-0'
            : 'translate-x-0 opacity-100'
        }
      `}
    >
      <div
        className={`
          ${bgColor} ${borderColor} ${textColor}
          border rounded-lg p-4 shadow-lg backdrop-blur-sm
          flex gap-3 items-start
        `}
      >
        {/* الرمز */}
        <div className={`flex-shrink-0 mt-0.5 ${iconColor}`}>{icon}</div>

        {/* المحتوى */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm leading-tight">
            {notification.title}
          </h3>
          <p className="text-sm opacity-90 mt-1 leading-snug">
            {notification.message}
          </p>

          {/* الإجراء المخصص */}
          {notification.action && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                notification.action?.onClick();
                handleClose();
              }}
              className="mt-2 h-auto p-0 text-xs font-medium hover:bg-transparent"
            >
              {notification.action.label}
            </Button>
          )}
        </div>

        {/* زر الإغلاق */}
        <button
          onClick={handleClose}
          className={`
            flex-shrink-0 p-1 rounded hover:bg-black/10 dark:hover:bg-white/10
            transition-colors opacity-70 hover:opacity-100
          `}
          aria-label="إغلاق الإشعار"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
