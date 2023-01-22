import { getLocales } from 'expo-localization';
import { I18n } from 'i18n-js';

const translations = {
  en: require('./en.json'),
  fr: require('./fr.json'),
};

const i18n = new I18n(translations);
i18n.locale = getLocales()[0].languageCode;
i18n.enableFallback = true;
i18n.defaultLocale = 'en';

export default i18n;
