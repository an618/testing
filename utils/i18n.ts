import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from '../messages/en.json';
import es from '../messages/es.json';

const resources = {
  en: { translation: en },
  es: { translation: es },
};

// Get initial language from localStorage or default to 'en'
const getInitialLanguage = () => {
  // Always default to 'en' for SSR to avoid hydration mismatches
  // The client will update the language after hydration
  return 'en';
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: getInitialLanguage(),
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
    // Disable suspense to prevent hydration issues
    react: {
      useSuspense: false,
    },
  });

export default i18n; 