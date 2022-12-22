import OneSignal from 'react-onesignal';

import config from '../config';

export const initOneSignal = async () => {
  await OneSignal.init({
    appId: config.onesignal.appId,
    safari_web_id: config.onesignal.safari_web_id,
    notifyButton: {
      enable: true,
    },
    subdomainName: config.onesignal.subdomainName,
    allowLocalhostAsSecureOrigin: config.dev,
    serviceWorkerPath: '/static/scripts/onesignal/OneSignalSDKWorker.js',
  });
  OneSignal.showSlidedownPrompt();
};

export const setOneSignalExternalUserId = user => {
  const userId = user.id.uuid;
  const phoneNumber = user.attributes.profile.privateData?.phoneNumber;
  OneSignal.setExternalUserId(userId);
  if (phoneNumber) {
    OneSignal.setSMSNumber(phoneNumber);
  }
  console.log('OneSignal set userId=', userId, 'phoneNumber=', phoneNumber);
};

export const removeOneSignalExternalUserId = () => {
  OneSignal.removeExternalUserId();
  OneSignal.logoutSMS();
};
