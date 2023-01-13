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
    serviceWorkerParam: { scope: '/static/scripts/onesignal/' },
    serviceWorkerPath: 'static/scripts/onesignal/OneSignalSDKWorker.js',
  });
  OneSignal.showSlidedownPrompt();
};

export const setOneSignalExternalUserId = user => {
  const userId = user.id.uuid;
  const { email, profile } = user.attributes;
  const publicData = profile.publicData;
  const phoneNumber = publicData.phoneNumber;
  const smsNotficationIsEnabled = publicData.smsNotficationIsEnabled;
  OneSignal.setExternalUserId(userId);
  OneSignal.sendTags({
    email,
    name: `${profile.firstName} ${profile.lastName}`,
    restaurantName: publicData.restaurantName,
  });
  if (smsNotficationIsEnabled && phoneNumber) {
    OneSignal.setSMSNumber(phoneNumber);
  }
  console.log(
    'OneSignal set userId=',
    userId,
    'phoneNumber=',
    smsNotficationIsEnabled && phoneNumber
  );
};

export const setOneSignalSMSNumber = phoneNumber => {
  OneSignal.setSMSNumber(phoneNumber);
  console.log('OneSignal after transaction set SMS phoneNumber=', phoneNumber);
};

export const removeOneSignalExternalUserId = () => {
  OneSignal.removeExternalUserId();
  OneSignal.logoutSMS();
};
