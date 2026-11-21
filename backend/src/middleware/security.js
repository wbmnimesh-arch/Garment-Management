const buckets = new Map();

function setSecurityHeaders(req, res, next) {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  next();
}

function allowSameOrigin(origin) {
  return (req, res, next) => {
    if (!["POST", "PUT", "PATCH", "DELETE"].includes(req.method)) return next();
    const requestOrigin = req.get("origin");
    if (requestOrigin && requestOrigin !== origin) return res.status(403).json({ message: "Request origin is not allowed." });
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
    if (buckets.size > 10000) {
      for (const [id, item] of buckets) if (item.expiresAt <= now) buckets.delete(id);
    }
    res.setHeader("RateLimit-Limit", String(max));
    res.setHeader("RateLimit-Remaining", String(Math.max(0, max - bucket.count)));
    if (bucket.count > max) return res.status(429).json({ message });
    return next();
  };
}

module.exports = { setSecurityHeaders, allowSameOrigin, rateLimit };
