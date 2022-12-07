const { createInstance, types } = require('sharetribe-flex-integration-sdk');
const OneSignal = require('onesignal-node');
const { intlEn, intlFr } = require('./intl');

const clientId = process.env.REACT_APP_FLEX_INTEGRATION_CLIENT_ID;
const clientSecret = process.env.REACT_APP_FLEX_INTEGRATION_CLIENT_SECRET;
const baseUrl = process.env.FLEX_INTEGRATION_BASE_URL || 'https://flex-integ-api.sharetribe.com';

const oneSignalClientAppId = process.env.REACT_APP_ONESIGNAL_APP_ID;
const oneSignalClientApiKey = process.env.ONE_SIGNAL_API_KEY;

const { UUID } = types;

const integrationSdk = createInstance({
  clientId,
  clientSecret,
  baseUrl,
});

const oneSignalClient = new OneSignal.Client(oneSignalClientAppId, oneSignalClientApiKey);

// eslint-disable-next-line no-unused-vars
const showUser = userId => {
  return integrationSdk.users.show({ id: new UUID(userId) });
};

// eslint-disable-next-line no-unused-vars
const showTransaction = transactionId => {
  return integrationSdk.transactions.show({
    id: new UUID(transactionId),
    included: ['customer', 'provider', 'booking', 'listing'],
  });
};

const tr = (key, options = {}) => {
  return {
    en: intlEn.formatMessage({ id: key }, options),
    fr: intlFr.formatMessage({ id: key }, options),
  };
};

const handleTransactionInitiated = async shEvent => {
  const transactionId = shEvent.attributes.resourceId;
  console.log(`Transaction initiated event ID=${shEvent.id.uuid} tx ID=${transactionId.uuid}`);
  const transaction = shEvent.attributes.resource;
  // console.log('transaction=', JSON.stringify(transaction,null,2));

  const providerId = transaction.relationships.provider.data.id.uuid;

  /*
  const customerId = transaction.relationships.customer.data.id.uuid;
  const customerResponse = await showUser(customerId);
  const customer = customerResponse.data.data;
  */

  const notification = {
    app_id: oneSignalClientAppId,
    headings: tr('push.TransactionInitiated.heading'),
    contents: tr('push.TransactionInitiated.content'),
    channel_for_external_user_ids: 'push',
    include_external_user_ids: [providerId],
  };

  const oneSignalRes = await oneSignalClient.createNotification(notification);
  if (oneSignalRes.body.id === '') {
    const err = new Error('Failed create notification');
    err.data = {
      notification,
      errors: oneSignalRes.body.errors,
    };
    throw err;
  }
};

const handleBookingCreated = async shEvent => {
  console.log('Booking created event handled');
};

const handleMessageCreated = async shEvent => {
  console.log('Message created event handled');
};

module.exports = {
  integrationSdk,
  handleTransactionInitiated,
  handleBookingCreated,
  handleMessageCreated,
};
