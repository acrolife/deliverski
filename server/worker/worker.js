require('../env').configureEnv();

const redis = require('redis');

const log = require('../log');
const { handleEventsQueue, pollEventsQueue } = require('./queues');
const {
  integrationSdk,
  handleTransactionInitiated,
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

const analyzeSharetribeEvent = async shEvent => {
  const { eventType } = shEvent.attributes;
  //console.log('shEvent=', JSON.stringify(shEvent,null,2));
  //console.log('event=', eventType, shEvent.attributes.createdAt, shEvent.attributes.sequenceId);

  switch (eventType) {
    case 'transaction/initiated':
      handleTransactionInitiated(shEvent);
      break;
    case 'booking/created':
      handleBookingCreated(shEvent);
      break;
    case 'message/created':
      handleMessageCreated(shEvent);
      break;

    default:
      break;
  }

  return 'Event handled';
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
    log.error(error, 'handle-event-error', shEvent);
    done(new Error(error));
  }
});
