const required = ["MONGO_URI", "JWT_SECRET"];

function loadConfig() {
  for (const name of required) {
    if (!process.env[name]?.trim()) throw new Error(`${name} is missing from backend/.env`);
  }
  if (process.env.JWT_SECRET.length < 32) throw new Error("JWT_SECRET must be at least 32 characters.");
  if (!/^mongodb(?:\+srv)?:\/\//i.test(process.env.MONGO_URI)) {
    throw new Error("MONGO_URI must be a MongoDB connection string.");
  }

  const port = Number(process.env.PORT || 5001);
  if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error("PORT must be a valid port number.");

  return Object.freeze({
    port,
    mongoUri: process.env.MONGO_URI,
    mongoDbName: process.env.MONGO_DB_NAME || "cutfree",
    jwtSecret: process.env.JWT_SECRET,
    clientOrigin: process.env.CLIENT_ORIGIN || "http://localhost:5174",
    nodeEnv: process.env.NODE_ENV || "development",
    trustProxyHops: Number(process.env.TRUST_PROXY_HOPS || 0),
  });
}

module.exports = loadConfig;
