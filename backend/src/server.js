require("dotenv").config();

const loadConfig = require("./config/env");
const { connectDatabase, mongoose } = require("./config/database");
const createApp = require("./app");

async function start() {
  const config = loadConfig();
  if (config.nodeEnv === "production" && !process.env.CLIENT_ORIGIN) throw new Error("CLIENT_ORIGIN must be set in production.");
  if (config.trustProxyHops < 0 || !Number.isInteger(config.trustProxyHops)) throw new Error("TRUST_PROXY_HOPS must be a non-negative integer.");
  await connectDatabase(config.mongoUri, config.mongoDbName);
  const server = createApp(config).listen(config.port, () => console.log(`CUT FREE API listening on port ${config.port}`));
  // Keep idle and slow connections from occupying server resources for too long.
  server.headersTimeout = 15_000;
  server.requestTimeout = 30_000;
  server.keepAliveTimeout = 5_000;

  const shutdown = (signal) => {
    console.log(`${signal} received; closing server.`);
    server.close(async () => {
      await mongoose.disconnect();
      process.exit(0);
    });
  };
  process.once("SIGINT", () => shutdown("SIGINT"));
  process.once("SIGTERM", () => shutdown("SIGTERM"));
}

start().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
