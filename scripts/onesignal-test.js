#!/usr/bin/env node

require('../server/env').configureEnv();

const OneSignal = require('onesignal-node');

const oneSignalClientAppId = process.env.REACT_APP_ONESIGNAL_APP_ID;
const oneSignalClientApiKey = process.env.ONE_SIGNAL_API_KEY;
const oneSignalClient = new OneSignal.Client(oneSignalClientAppId, oneSignalClientApiKey);

/*
This corresponds to the sharetribe user ID "User ID" which can be seen in
the flex console. If this user has logged in flex, he will receive a notification.
*/
const providerId = '6385c71e-a424-4505-b650-309a76c41c3b';
/* This corresponds OneSignal template ID */
//const template_id = '2fc79728-fe06-4f36-be0c-4cc315a0599d';

const notification = {
  app_id: oneSignalClientAppId,
  contents: {
    en: 'test notification'
  },
  channel_for_external_user_ids: 'push',
  include_external_user_ids: [providerId],
};

const run = async () => {
  const oneSignalRes = await oneSignalClient.createNotification(notification);
  if (oneSignalRes.body.id === '') {
    const err = new Error('Failed create notification');
    err.data = {
      notification,
      errors: oneSignalRes.body.errors,
    };
    console.error('error=', JSON.stringify(err.data,null,2));
    throw err;
  }
};

console.log('Start');
run();
console.log('Done');
