import cookies from 'js-cookie';
import config from '../config';

const defaultLanguage = config.locale;

export const getLocale = () => {
  if (typeof global !== 'undefined' && global.initLocale) {
    return global.initLocale;
  }
  if (cookies.get('locale')) {
    return cookies.get('locale') === 'fr' ? 'fr' : 'en';
  }
  const computerLanguage = getLang();
  const locale = !computerLanguage
    ? defaultLanguage
    : computerLanguage.includes('fr')
    ? 'fr'
    : 'en';
  return locale;
};

export const setLocale = locale => {
  cookies.set('locale', locale, { path: '/' });
};

const getLang = () => {
  if (typeof navigator !== 'undefined') {
    if (!navigator) return defaultLanguage;
    if (navigator.languages !== undefined) return navigator.languages[0].split(/[-_]/)[0];
    else return navigator.language.split(/[-_]/)[0];
  } else {
    return null;
  }
};
