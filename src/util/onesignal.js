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
  if (config.onesignal.debug && window) {
    window.OneSignal.log.setLevel('trace');
  }
  OneSignal.showSlidedownPrompt();
};

export const setOneSignalExternalUserId = user => {
  const userId = user.id.uuid;
  const { email, profile } = user.attributes;
  const publicData = profile.publicData;
  OneSignal.setExternalUserId(userId);
  OneSignal.sendTags({
    email,
    name: `${profile.firstName} ${profile.lastName}`,
    restaurantName: publicData.restaurantName,
  });
  console.log('OneSignal set userId=', userId);
};

export const removeOneSignalExternalUserId = () => {
  OneSignal.removeExternalUserId();
};
