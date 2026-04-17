// Simple in-memory rate limiter for Next.js API routes
// Note: In a real production distributed system, use Redis.
const cache = new Map();

export function rateLimit(ip, limit = 5, windowMs = 60000) {
  const now = Date.now();
  const userData = cache.get(ip) || { count: 0, startTime: now };

  if (now - userData.startTime > windowMs) {
    userData.count = 1;
    userData.startTime = now;
  } else {
    userData.count++;
  }

  cache.set(ip, userData);

  return {
    success: userData.count <= limit,
    remaining: Math.max(0, limit - userData.count),
    reset: userData.startTime + windowMs
  };
}
