const buckets = new Map()

// In-memory sliding-window limiter, keyed by IP. Fine for a single-process
// hackathon demo; would need a shared store (e.g. Redis) behind a load
// balancer with multiple instances.
export function rateLimit({ windowMs = 60_000, max = 20 } = {}) {
  return (req, res, next) => {
    const key = req.ip
    const now = Date.now()
    const recent = (buckets.get(key) ?? []).filter((t) => now - t < windowMs)

    if (recent.length >= max) {
      return res.status(429).json({ error: 'Too many requests. Please wait a moment and try again.' })
    }

    recent.push(now)
    buckets.set(key, recent)
    next()
  }
}
