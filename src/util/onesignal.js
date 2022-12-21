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

export const setOneSignalExternalUserId = async userId => {
  await OneSignal.setExternalUserId(userId);
};

export const removeOneSignalExternalUserId = async () => {
  await OneSignal.removeExternalUserId();
};
