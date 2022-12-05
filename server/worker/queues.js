const Queue = require('bull');

const redisUrl = process.env.REDIS_URL;

const pollEventsQueue = new Queue('poll events job Q', redisUrl);
const handleEventsQueue = new Queue('sharetribe events handler Q', redisUrl, {
  defaultJobOptions: {
    attempts: 2,
    backoff: 30000,
  },
});

module.exports = {
  handleEventsQueue,
  pollEventsQueue,
};
