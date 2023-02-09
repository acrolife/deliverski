const { createIntl, createIntlCache } = require('@formatjs/intl');
const { readFileSync } = require('fs');
const yaml = require('js-yaml');
const { join } = require('path');

const flattenMessages = (nestedMessages, prefix = '') => {
  return Object.keys(nestedMessages).reduce((messages, key) => {
    let value = nestedMessages[key];
    let prefixedKey = prefix ? `${prefix}.${key}` : key;

    if (typeof value === 'string') {
      messages[prefixedKey] = value;
    } else {
      Object.assign(messages, flattenMessages(value, prefixedKey));
    }

    return messages;
  }, {});
};

const readYaml = fileName => {
  const rawContent = yaml.load(readFileSync(join(__dirname, fileName), 'utf8'));
  return flattenMessages(rawContent);
};

const messagesEn = readYaml('translations/en.yml');
const messagesFr = readYaml('translations/fr.yml');

const cache = createIntlCache();

const intlEn = createIntl(
  {
    locale: 'en',
    defaultLocale: 'en',
    messages: messagesEn,
  },
  cache
);

const intlFr = createIntl(
  {
    locale: 'fr',
    defaultLocale: 'en',
    messages: messagesFr,
  },
  cache
);

module.exports = {
  intlEn,
  intlFr,
};
