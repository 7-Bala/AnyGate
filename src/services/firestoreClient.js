const DEFAULT_INTERVAL_MS = 5000

// Read-only congestion feed for the frontend. Currently polls the server's
// /api/congestion route (a local stand-in for a Firestore `congestion`
// collection); the intended real shape is one doc per facility id with
// { value: number 0-100, updatedAt: ISO string, trend: number }, public
// read / server-only write. Swapping this function's internals to a real
// Firestore onSnapshot listener requires no change to callers.
export function subscribeToCongestion(onUpdate, { intervalMs = DEFAULT_INTERVAL_MS } = {}) {
  let cancelled = false

  async function poll() {
    try {
      const res = await fetch('/api/congestion')
      if (!res.ok) throw new Error(`congestion fetch failed: ${res.status}`)
      const data = await res.json()
      if (!cancelled) onUpdate(data)
    } catch {
      // Live data is best-effort; the engine treats missing/stale entries
      // as unknown rather than crashing, so failures here are silent.
    }
  }

  poll()
  const handle = setInterval(poll, intervalMs)

  return function unsubscribe() {
    cancelled = true
    clearInterval(handle)
  }
}

export async function fetchCongestionOnce() {
  const res = await fetch('/api/congestion')
  if (!res.ok) throw new Error(`congestion fetch failed: ${res.status}`)
  return res.json()
}
