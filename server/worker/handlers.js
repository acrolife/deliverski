const { createInstance, types } = require('sharetribe-flex-integration-sdk');

const clientId = process.env.REACT_APP_FLEX_INTEGRATION_CLIENT_ID;
const clientSecret = process.env.REACT_APP_FLEX_INTEGRATION_CLIENT_SECRET;
const baseUrl = process.env.FLEX_INTEGRATION_BASE_URL || 'https://flex-integ-api.sharetribe.com';

const { UUID } = types;

const integrationSdk = createInstance({
  clientId,
  clientSecret,
  baseUrl,
});

const showUser = userId => {
  return integrationSdk.users.show({ id: new UUID(userId) });
};

const showTransaction = transactionId => {
  return integrationSdk.transactions.show({
    id: new UUID(transactionId),
    included: ['customer', 'provider', 'booking', 'listing'],
  });
};

const handleTransactionInitiated = shEvent => {
  console.log('Transaction initiated event handled');
};

const handleBookingCreated = async shEvent => {
  console.log('Booking created event handled');

  const transactionId = shEvent.attributes.resource.relationships.transaction.data.id.uuid;
  const txResponse = await showTransaction(transactionId);
  const transaction = txResponse.data.data;

  const providerId = transaction.relationships.provider.data.id.uuid;
  const providerResponse = await showUser(providerId);
  const provider = providerResponse.data.data;

  const customerId = transaction.relationships.customer.data.id.uuid;
  const customerResponse = await showUser(customerId);
  const customer = customerResponse.data.data;
};

const handleMessageCreated = shEvent => {
  console.log('Message created event handled');
};

module.exports = {
  integrationSdk,
  handleTransactionInitiated,
  handleBookingCreated,
  handleMessageCreated,
};
