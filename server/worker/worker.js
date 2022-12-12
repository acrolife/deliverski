require('../env').configureEnv();

const redis = require('redis');

const log = require('../log');
const { handleEventsQueue, pollEventsQueue } = require('./queues');
const {
  integrationSdk,
  handleTransactionInitiated,
  handleTransactionTransitioned,
  handleBookingCreated,
  handleMessageCreated,
} = require('./handlers');

const redisUrl = process.env.REDIS_URL;
const LISTEN_EVENT_TYPES = [
  'transaction/initiated',
  'transaction/transitioned',
  'transaction/updated',
  'booking/created',
  'booking/updated',
  'message/created',
];

const redisClient = redis.createClient(redisUrl);

const connectRedis = async () => {
  await redisClient.connect();
};
connectRedis();

const startTime = new Date();

const querySharetribeEvents = args => {
  const filter = { eventTypes: LISTEN_EVENT_TYPES.join(',') };
  const params = { ...args, ...filter };
  return integrationSdk.events.query(params);
};

const analyzeSharetribeEvent = shEvent => {
  const { eventType } = shEvent.attributes;
  //console.log('shEvent=', JSON.stringify(shEvent, null, 2));
  //console.log('event=', eventType, shEvent.attributes.createdAt, shEvent.attributes.sequenceId);

  switch (eventType) {
    case 'transaction/initiated':
      return handleTransactionInitiated(shEvent);
    case 'transaction/transitioned':
      return handleTransactionTransitioned(shEvent);
    case 'booking/created':
      return handleBookingCreated(shEvent);
    case 'message/created':
      return handleMessageCreated(shEvent);

    default:
      break;
  }
};

pollEventsQueue.add(null, { repeat: { cron: '*/10 * * * * *' } });

pollEventsQueue.process(async (_, done) => {
  try {
    const rawSequenceId = await redisClient.get('lastSequenceId');
    const sequenceId = rawSequenceId === 'null' ? null : rawSequenceId;
    const params =
      sequenceId && !isNaN(sequenceId)
        ? { startAfterSequenceId: sequenceId }
        : { createdAtStart: startTime };
    /* Uncomment this if you want read all transactions from 2022-12-04 over and over again
    const params = { createdAtStart: new Date('2022-12-07') };
    */

    const res = await querySharetribeEvents(params);

    const events = res.data.data;
    const lastEvent = events[events.length - 1];
    const lastSequenceId = lastEvent ? lastEvent.attributes.sequenceId : sequenceId;

    await redisClient.set(
      'lastSequenceId',
      lastSequenceId && !isNaN(lastSequenceId) ? String(lastSequenceId) : '',
      redis.print
    );
    handleEventsQueue.addBulk(events.map(evt => ({ data: evt })));

    done();
  } catch (err) {
    log.error(err, 'poll-events-error', err.data.errors);
    done(new Error(err));
  }
});

handleEventsQueue.process(async ({ data: shEvent }, done) => {
  try {
    await analyzeSharetribeEvent(shEvent);
    done();
  } catch (error) {
    log.error(error, 'handle-event-error', { sharetribeEvent: shEvent.id.uuid, data: error.data });
    done(new Error(error));
  }
});
