const buckets = new Map();

function setSecurityHeaders(req, res, next) {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Cross-Origin-Resource-Policy", "same-origin");
  res.setHeader("X-Permitted-Cross-Domain-Policies", "none");
  res.setHeader("Content-Security-Policy", "default-src 'none'; frame-ancestors 'none'; base-uri 'none'; form-action 'none'");
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
  res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
  res.setHeader("Origin-Agent-Cluster", "?1");
  if (req.secure) res.setHeader("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  next();
}

function allowSameOrigin(origin) {
  return (req, res, next) => {
    if (!["POST", "PUT", "PATCH", "DELETE"].includes(req.method)) return next();
    const requestOrigin = req.get("origin");
    if (requestOrigin !== origin) return res.status(403).json({ message: "Request origin is not allowed." });
    // Cookie-authenticated browser mutations must not be accepted from cross-site contexts.
    if (req.get("sec-fetch-site") === "cross-site") return res.status(403).json({ message: "Cross-site requests are not allowed." });
    return next();
  };
}

function rateLimit({ windowMs, max, message }) {
  return (req, res, next) => {
    const now = Date.now();
    const key = `${req.ip}:${req.baseUrl}${req.path}`;
    let bucket = buckets.get(key);
    if (!bucket || bucket.expiresAt <= now) bucket = { count: 0, expiresAt: now + windowMs };
    bucket.count += 1;
    buckets.set(key, bucket);
    // Bound memory use if an attacker sends requests from many distinct IPs.
    if (buckets.size > 10000) {
      for (const [id, item] of buckets) if (item.expiresAt <= now) buckets.delete(id);
      if (buckets.size > 12000) {
        for (const id of buckets.keys()) {
          buckets.delete(id);
          if (buckets.size <= 10000) break;
        }
      }
    }
    res.setHeader("RateLimit-Limit", String(max));
    res.setHeader("RateLimit-Remaining", String(Math.max(0, max - bucket.count)));
    if (bucket.count > max) return res.status(429).json({ message });
    return next();
  };
}

module.exports = { setSecurityHeaders, allowSameOrigin, rateLimit };
