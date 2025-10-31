import React from 'react';
import { useTranslation } from 'react-i18next';

export function NotificationsPanel() {
  const { t } = useTranslation();

  const notifications = [
    {
      id: 1,
      title: t('NotificationsPanel.notifications.0.title'),
      description: t('NotificationsPanel.notifications.0.description'),
      date: '20July 2024, 11:30 AM',
      timeAgo: '2 mins ago',
      unread: true,
    },
    {
      id: 2,
      title: t('NotificationsPanel.notifications.1.title'),
      description: t('NotificationsPanel.notifications.1.description'),
      date: '20July 2024, 11:30 AM',
      timeAgo: '2 mins ago',
      unread: true,
    },
  ];

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm w-full md:max-w-md min-w-[320px]">
      <div className="flex items-center justify-between mb-4">
        <span className="text-lg font-semibold text-[#081021]">{t('NotificationsPanel.title')}</span>
        <a href="#" className="text-xs text-[#6C3DF4] font-medium hover:underline">{t('NotificationsPanel.viewAll')}</a>
      </div>
      <div className="flex flex-col gap-4">
        {notifications.map((n) => (
          <div key={n.id} className="flex flex-col gap-1 pb-3 border-b border-gray-100 last:border-b-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-[#081021] leading-tight">{n.title}</span>
            </div>
            <span className="text-xs text-[#94A3B8] leading-snug line-clamp-1">{n.description}</span>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-[#64748B] font-medium">{n.date}</span>
              <span className="text-[8px] text-[#94A3B8] mx-1">•</span>
              <span className="flex items-center gap-1 text-xs text-[#64748B]">
                {n.unread && <span className="w-2 h-2 rounded-full bg-pink-500 inline-block mr-1" />}
                {n.timeAgo}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 