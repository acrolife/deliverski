#!/usr/bin/env node

/* NODE_ENV=development ./scripts/query-events.js */

require('../server/env').configureEnv();

const { createInstance } = require('sharetribe-flex-integration-sdk');

const clientId = process.env.REACT_APP_FLEX_INTEGRATION_CLIENT_ID;
const clientSecret = process.env.REACT_APP_FLEX_INTEGRATION_CLIENT_SECRET;
const baseUrl = process.env.FLEX_INTEGRATION_BASE_URL || 'https://flex-integ-api.sharetribe.com';

const integrationSdk = createInstance({
  clientId,
  clientSecret,
  baseUrl,
});

const LISTEN_EVENT_TYPES = [
  'transaction/initiated',
  'transaction/transitioned',
  'transaction/updated',
  'booking/created',
  'booking/updated',
  'message/created',
];

const querySharetribeEvents = args => {
  const filter = { eventTypes: LISTEN_EVENT_TYPES.join(',') };
  const params = { ...args, ...filter };
  return integrationSdk.events.query(params);
};

const run = async () => {
  const params = { createdAtStart: new Date('2022-12-07') };
  const res = await querySharetribeEvents(params);

  const events = res.data.data;

  // const EXAMINE_TX_ID='63908b90-fbb1-4db4-ab92-2f445e97643b'; // decline
  // const EXAMINE_TX_ID='63931f94-d9ad-47b9-b955-7b4012322e8d'; // stuck in 'confirm-payment'
  const EXAMINE_TX_ID = '63931b66-4417-4344-ab82-c9a4fc895fd5'; // accept
  events.forEach(shEvent => {
    const { eventType, resourceId } = shEvent.attributes;
    console.log('------ resourceId=', resourceId.uuid, ' eventType=', eventType);
    if (resourceId.uuid === EXAMINE_TX_ID && eventType === 'transaction/transitioned') {
      const { resource, previousValues } = shEvent.attributes;
      // console.log('shEvent=', JSON.stringify(shEvent,null,2));
      console.log('resource=', JSON.stringify(resource, null, 2));
      const {
        transitions: previousTransitions,
        lastTransition: previousLastTransition,
      } = previousValues.attributes;
      const { transitions, lastTransition } = resource.attributes;

      // console.log('previousTransitions=', JSON.stringify(previousTransitions,null,2));
      // console.log('transitions=', JSON.stringify(transitions,null,2));
      console.log('======');
      console.log('previousLastTransition=', JSON.stringify(previousLastTransition, null, 2));
      console.log('lastTransition=', JSON.stringify(lastTransition, null, 2));
    }
  });
};

run();
