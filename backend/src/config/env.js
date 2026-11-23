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

  const nodeEnv = process.env.NODE_ENV || "development";
  if (!["development", "test", "production"].includes(nodeEnv)) throw new Error("NODE_ENV must be development, test, or production.");
  const clientOrigin = process.env.CLIENT_ORIGIN || "http://localhost:5174";
  let parsedOrigin;
  try { parsedOrigin = new URL(clientOrigin); } catch { throw new Error("CLIENT_ORIGIN must be a valid origin URL."); }
  if (parsedOrigin.origin !== clientOrigin || !["http:", "https:"].includes(parsedOrigin.protocol)) throw new Error("CLIENT_ORIGIN must contain only the scheme, host, and optional port.");
  if (nodeEnv === "production" && parsedOrigin.protocol !== "https:") throw new Error("CLIENT_ORIGIN must use HTTPS in production.");
  const trustProxyHops = Number(process.env.TRUST_PROXY_HOPS || 0);
  if (!Number.isInteger(trustProxyHops) || trustProxyHops < 0) throw new Error("TRUST_PROXY_HOPS must be a non-negative integer.");

  return Object.freeze({
    port,
    mongoUri: process.env.MONGO_URI,
    mongoDbName: process.env.MONGO_DB_NAME || "cutfree",
    jwtSecret: process.env.JWT_SECRET,
    clientOrigin,
    nodeEnv,
    trustProxyHops,
  });
}

module.exports = loadConfig;
