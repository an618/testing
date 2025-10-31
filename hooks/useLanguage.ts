import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import i18nInit from '@/utils/i18n';

export function useLanguage() {
  const { t, i18n } = useTranslation();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    // Set initial language from localStorage or default
    const storedLang = localStorage.getItem('lang');
    if (storedLang && storedLang !== i18nInit.language) {
      i18nInit.changeLanguage(storedLang);
    }
  }, []);

  const switchLocale = () => {
    const newLocale = i18nInit.language === 'en' ? 'es' : 'en';
    i18nInit.changeLanguage(newLocale);
    localStorage.setItem('lang', newLocale);
  };

  return {
    t,
    i18n,
    currentLanguage: i18nInit.language,
    switchLocale,
    isClient
  };
} 