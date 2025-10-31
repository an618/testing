import React from 'react';
import { useTranslation } from 'react-i18next';

export function ComplianceStatusCard() {
  const { t } = useTranslation();

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm w-full">
      <div className="text-xl font-semibold text-[#081021] mb-4">{t('ComplianceStatusCard.title')}</div>
      <div className="flex flex-col gap-4 mb-2">
        <div>
          <div className="font-semibold text-[#081021] text-base mb-0.5">{t('ComplianceStatusCard.safeHarbor2021')}</div>
          <div className="text-[#64748B] text-sm leading-snug">
            {t('ComplianceStatusCard.description')}
          </div>
        </div>
        <div>
          <div className="font-semibold text-[#081021] text-base mb-0.5">{t('ComplianceStatusCard.safeHarbor2021')}</div>
          <div className="text-[#64748B] text-sm leading-snug">
            {t('ComplianceStatusCard.description')}
          </div>
        </div>
      </div>
      <a href="#" className="text-[#6C3DF4] text-sm font-medium hover:underline">{t('ComplianceStatusCard.viewDashboard')}</a>
    </div>
  );
} 