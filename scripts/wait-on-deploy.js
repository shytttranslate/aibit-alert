// eslint-disable-next-line @typescript-eslint/no-var-requires
const axios = require('axios');
const signal = AbortSignal.timeout(15 * 1000);
// eslint-disable-next-line @typescript-eslint/no-var-requires
const wait = require('wait');
const untilReady = async () => {
  if (signal.aborted) {
    throw new Error(
      `time out health check: ${process.env.DOMAIN}/api/health-check`,
    );
  }
  return new Promise(async (resolve) => {
    try {
      const { data } = await axios.get(
        `${process.env.DOMAIN}/api/health-check`,
      );
      if (data.name) {
        resolve();
      } else {
        return untilReady();
      }
    } catch (err) {
      return untilReady();
    }
  });
};

(async () => {
  await untilReady();
  console.log(`successfully deployed: ${process.env.DOMAIN}`);
  await wait(10000);
  console.log('wait it....to grateful listen');
})();
