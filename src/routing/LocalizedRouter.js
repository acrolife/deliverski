import React from 'react';
import {
  IntlProvider,
} from 'react-intl';
import { Route, Redirect } from 'react-router-dom';

import messagesEn from '../translations/en.json';
import messagesFr from '../translations/fr.json';

const translations = {
  en: messagesEn,
  fr: messagesFr,
}

const defaultLanguage = 'en';

export const LocalizedRouter = ({
  children,
  RouterComponent
}) => (
  <RouterComponent>
    <Route path="/:lang([a-z]{2})">
      {({ match, location }) => {
        /**
         * Get current language
         * Set default locale to en if base path is used without a language
         */
        const params = match ? match.params : {};
        const { lang = defaultLanguage } = params;

        /**
         * If language is not in route path, redirect to language root
         */
        const { pathname } = location;
        if (!pathname.includes(`/${lang}/`)) {
          return <Redirect to={`/${lang}/`} />;
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
  </RouterComponent>
);

export default LocalizedRouter;
