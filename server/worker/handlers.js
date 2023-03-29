const { createInstance, types } = require('sharetribe-flex-integration-sdk');
const OneSignal = require('onesignal-node');
const { intlEn, intlFr } = require('./intl');

const clientId = process.env.REACT_APP_FLEX_INTEGRATION_CLIENT_ID;
const clientSecret = process.env.REACT_APP_FLEX_INTEGRATION_CLIENT_SECRET;
const baseUrl = process.env.FLEX_INTEGRATION_BASE_URL || 'https://flex-integ-api.sharetribe.com';

const oneSignalClientAppId = process.env.REACT_APP_ONESIGNAL_APP_ID;
const oneSignalClientApiKey = process.env.ONE_SIGNAL_API_KEY;
const oneSignalSmsFrom = process.env.ONE_SIGNAL_SMS_FROM;

const { UUID } = types;

const integrationSdk = createInstance({
  clientId,
  clientSecret,
  baseUrl,
});

const oneSignalClient = new OneSignal.Client(oneSignalClientAppId, oneSignalClientApiKey);

const oneSignalCreateNotification = async notification => {
  const oneSignalRes = await oneSignalClient.createNotification(notification);
  if (oneSignalRes.body.id === '') {
    if (oneSignalRes.body.recipients === 0) {
      console.error('oneSignal: Zero recipients ', JSON.stringify(oneSignalRes.body.errors));
      return true; // Ignore the error if recipients are not subscribed
    }

    const err = new Error('oneSignal: Failed create notification');
    err.data = {
      notification,
      errors: oneSignalRes.body.errors,
    };
    throw err;
  }
};

// eslint-disable-next-line no-unused-vars
const showUser = userId => {
  return integrationSdk.users.show({ id: new UUID(userId) }).then(response => response.data.data);
};

// eslint-disable-next-line no-unused-vars
const showTransaction = transactionId => {
  return integrationSdk.transactions.show({
    id: new UUID(transactionId),
    included: ['customer', 'provider', 'booking', 'listing'],
  });
};

const tr = (key, options = {}) => {
  const missing = `Missing translation: ${key}`;
  return {
    en: intlEn.formatMessage({ id: key, defaultMessage: `en: ${missing}` }, options),
    fr: intlFr.formatMessage({ id: key, defaultMessage: `fr: ${missing}` }, options),
  };
};

const getProviderId = transaction => {
  return transaction.relationships.provider.data.id.uuid;
};

const getCustomerId = transaction => {
  return transaction.relationships.customer.data.id.uuid;
};

const getProviderPhoneNumber = user => {
  if (!user) {
    return null;
  }
  const publicData = user.attributes.profile.publicData;
  const phoneNumber = publicData.phoneNumber;
  const smsNotficationIsEnabled = publicData.smsNotficationIsEnabled;
  return smsNotficationIsEnabled && phoneNumber;
};

// eslint-disable-next-line no-unused-vars
const isShipping = transaction => {
  return transaction?.attributes?.protectedData?.deliveryMethod === 'shipping';
};

// eslint-disable-next-line no-unused-vars
const isPickup = transaction => {
  return transaction?.attributes?.protectedData?.deliveryMethod === 'pickup';
};

const getTransactionPhoneNumber = transaction => {
  return isShipping(transaction)
    ? transaction?.attributes?.protectedData?.shippingDetails?.phoneNumber
    : null;
};

const handleTransactionInitiated = async shEvent => {
  const transactionId = shEvent.attributes.resourceId;
  console.log(`Transaction initiated event ID=${shEvent.id.uuid} tx ID=${transactionId.uuid}`);
  const transaction = shEvent.attributes.resource;
  // console.log('transaction=', JSON.stringify(transaction,null,2));

  const providerId = getProviderId(transaction);
  const provider = await showUser(providerId);
  const providerPhoneNumber = getProviderPhoneNumber(provider);

  const notification = {
    app_id: oneSignalClientAppId,
    headings: tr('push.TransactionInitiated.heading'),
    contents: tr('push.TransactionInitiated.content'),
    channel_for_external_user_ids: 'push',
    include_external_user_ids: [providerId],
  };

  oneSignalCreateNotification(notification);

  if (providerPhoneNumber) {
    const notificationSMS = {
      app_id: oneSignalClientAppId,
      name: 'Transaction Initiated',
      sms_from: oneSignalSmsFrom,
      contents: tr('sms.TransactionInitiated.content'),
      // can be added public available images
      // sms_media_urls: [],
      include_phone_numbers: [providerPhoneNumber],
    };
    oneSignalCreateNotification(notificationSMS);
  }
};

const handleTransitionAccept = async transaction => {
  console.log(`Transaction tx ID=${transaction.id.uuid} transition/accept`);
  const providerId = getProviderId(transaction);
  const customerId = getCustomerId(transaction);
  const provider = await showUser(providerId);
  const providerPublicData = provider.attributes.profile.publicData || {};
  const preparationTime = providerPublicData.preparationTime;
  const mealIsReadyTime = providerPublicData.mealIsReadyTime;
  const deliveryTime = providerPublicData.deliveryTime;
  const pickupAddress = providerPublicData.pickupAddress;
  const customerPhoneNumber = getTransactionPhoneNumber(transaction);
  const notification = {
    app_id: oneSignalClientAppId,
    channel_for_external_user_ids: 'push',
    include_external_user_ids: [customerId],
  };
  const notificationSMS = {
    app_id: oneSignalClientAppId,
    name: 'Transaction Accept',
    sms_from: oneSignalSmsFrom,
    include_phone_numbers: [customerPhoneNumber],
  };

  if (isPickup(transaction)) {
    notification.headings = tr('push.TransitionAccept.pickup.heading');
    notification.contents = tr('push.TransitionAccept.pickup.content', {
      preparationTime,
      mealIsReadyTime,
      pickupAddress,
    });
    notificationSMS.contents = tr('sms.TransitionAccept.pickup.content', {
      preparationTime,
      mealIsReadyTime,
      pickupAddress,
    });
  } else {
    notification.headings = tr('push.TransitionAccept.shipping.heading');
    notification.contents = tr('push.TransitionAccept.shipping.content', {
      preparationTime,
      deliveryTime,
    });
    notificationSMS.contents = tr('sms.TransitionAccept.shipping.content', {
      preparationTime,
      deliveryTime,
    });
  }

  oneSignalCreateNotification(notification);

  if (customerPhoneNumber) {
    oneSignalCreateNotification(notificationSMS);
  }
};

const handleTransitionDecline = async transaction => {
  console.log(`Transaction tx ID=${transaction.id.uuid} transition/decline`);
  // const providerId = getProviderId(transaction);
  const customerId = getCustomerId(transaction);
  const customerPhoneNumber = getTransactionPhoneNumber(transaction);
  const { transitions } = transaction.attributes;
  const transition = transitions.at(-1);
  const isSystemTransition = transition.by === 'system';
  const notification = {
    app_id: oneSignalClientAppId,
    channel_for_external_user_ids: 'push',
    include_external_user_ids: [customerId],
  };
  const notificationSMS = {
    app_id: oneSignalClientAppId,
    name: 'Transaction Decline',
    sms_from: oneSignalSmsFrom,
    include_phone_numbers: [customerPhoneNumber],
  };

  if (isSystemTransition) {
    notification.headings = tr('push.TransitionDecline.system.heading');
    notification.contents = tr('push.TransitionDecline.system.content', {
      autoDeclineTime: '15',
    });
    notificationSMS.contents = tr('sms.TransitionDecline.system.content', {
      autoDeclineTime: '15',
    });
  } else {
    notification.headings = tr('push.TransitionDecline.provider.heading');
    notification.contents = tr('push.TransitionDecline.provider.content');
    notificationSMS.contents = tr('sms.TransitionDecline.provider.content');
  }

  oneSignalCreateNotification(notification);

  if (customerPhoneNumber) {
    oneSignalCreateNotification(notificationSMS);
  }
};

const handleTransitionMarkPrepared = async transaction => {
  console.log(`Transaction tx ID=${transaction.id.uuid} transition/mark-prepared`);
  const providerId = getProviderId(transaction);
  const customerId = getCustomerId(transaction);
  const provider = await showUser(providerId);
  const providerPublicData = provider.attributes.profile.publicData || {};
  const mealIsReadyTime = providerPublicData.mealIsReadyTime;
  const deliveryTime = providerPublicData.deliveryTime;
  const transactionId = transaction.id.uuid;
  const customerPhoneNumber = getTransactionPhoneNumber(transaction);
  const notification = {
    app_id: oneSignalClientAppId,
    channel_for_external_user_ids: 'push',
    include_external_user_ids: [customerId],
  };
  const notificationSMS = {
    app_id: oneSignalClientAppId,
    name: 'Transaction Mark Prepared',
    sms_from: oneSignalSmsFrom,
    include_phone_numbers: [customerPhoneNumber],
  };

  if (isPickup(transaction)) {
    notification.headings = tr('push.TransitionMarkPrepared.pickup.heading', {
      transactionId,
    });
    notification.contents = tr('push.TransitionMarkPrepared.pickup.content', {
      mealIsReadyTime,
    });
    notificationSMS.contents = tr('sms.TransitionMarkPrepared.pickup.content', {
      transactionId,
      mealIsReadyTime,
    });
  } else {
    notification.headings = tr('push.TransitionMarkPrepared.shipping.heading', {
      transactionId,
    });
    notification.contents = tr('push.TransitionMarkPrepared.shipping.content', {
      deliveryTime,
    });
    notificationSMS.contents = tr('sms.TransitionMarkPrepared.shipping.content', {
      transactionId,
      deliveryTime,
    });
  }

  oneSignalCreateNotification(notification);

  if (customerPhoneNumber) {
    oneSignalCreateNotification(notificationSMS);
  }
};

const handleTransactionTransitioned = shEvent => {
  const transactionId = shEvent.attributes.resourceId;
  console.log(`Transaction transitioned event ID=${shEvent.id.uuid} tx ID=${transactionId.uuid}`);
  const { resource } = shEvent.attributes;
  const { lastTransition } = resource.attributes;
  switch (lastTransition) {
    case 'transition/accept':
      return handleTransitionAccept(resource);

    case 'transition/decline':
      return handleTransitionDecline(resource);

    case 'transition/expire-accept':
      return handleTransitionDecline(resource);

    case 'transition/mark-prepared':
      return handleTransitionMarkPrepared(resource);

    default:
      break;
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
  handleTransactionTransitioned,
  handleBookingCreated,
  handleMessageCreated,
};
