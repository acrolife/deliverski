import React from 'react';
import { IntlProvider } from 'react-intl';
import { Route, Redirect } from 'react-router-dom';
import { getLocale, setLocale } from '../util/localeHelpers.js';

import messagesEn from '../translations/en.json';
import messagesFr from '../translations/fr.json';

const translations = {
  en: messagesEn,
  fr: messagesFr,
};

const LocalizedRouter = ({ children }) => (
  <Route path="/:lang([a-z]{2})">
    {({ match, location }) => {
      /**
       * Get current language
       * Set default locale to en if base path is used without a language
       */
      const params = match ? match.params : {};
      const { lang = getLocale() } = params;

      /**
       * If language is not in route path, redirect to language root
       */
      const { pathname } = location;

      if (pathname.match(/^\/en|fr\/?$/)) {
        setLocale(lang);
      }

      if (pathname !== '/en' && pathname !== '/fr' && !pathname.includes(`/${lang}/`)) {
        const to = `/${lang}${pathname}`;
        return <Redirect to={to} />;
      }

      /**
       * Return Intl provider with default language set
       */
      return (
        <IntlProvider locale={lang} messages={translations[lang]} textComponent="span">
          {children}
        </IntlProvider>
      );
    }}
  </Route>
);

export default LocalizedRouter;
