#!/usr/bin/env node

require('../server/env').configureEnv();

const client = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

const phoneNumber = process.env.SEND_TO_PHONE_NUMBER;

if (!phoneNumber) {
  console.error('SEND_TO_PHONE_NUMBER env is not set');
  process.exit(1);
}

const body = 'New order test!';
const message = {
  from: process.env.TWILIO_PHONE_NUMBER,
  to: phoneNumber,
  body,
};

const run = async () => {
  try {
    const res = await client.messages.create(message);
    console.log('twilio res=', JSON.stringify(res, null, 2));
  } catch (err) {
    console.log(err);
  }
};

console.log('Start');
run();
console.log('Done');
