#!/usr/bin/env node

/* NODE_ENV=development ./scripts/query-events.js */

require('../server/env').configureEnv();

const { createInstance, types: sdkTypes } = require('sharetribe-flex-integration-sdk');

const clientId = process.env.REACT_APP_FLEX_INTEGRATION_CLIENT_ID;
const clientSecret = process.env.REACT_APP_FLEX_INTEGRATION_CLIENT_SECRET;
const baseUrl = process.env.FLEX_INTEGRATION_BASE_URL || 'https://flex-integ-api.sharetribe.com';

const { UUID } = sdkTypes;

const integrationSdk = createInstance({
  clientId,
  clientSecret,
  baseUrl,
});

const EXAMINE_TX_ID = '63d39d61-77f7-44bd-add2-f037772b4b0c'; // accept

const run = async () => {
  const txRes = await integrationSdk.transactions.show({
    id: new UUID(EXAMINE_TX_ID),
  });
  console.log(JSON.stringify(txRes.data.data, null, 2));
};

run();
