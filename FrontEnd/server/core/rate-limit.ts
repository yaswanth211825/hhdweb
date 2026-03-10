import type { NextRequest } from "next/server"
import { ApiError } from "./http"

type Bucket = {
  count: number
  windowStart: number
}

// Simple in-memory rate limiter (per instance).
// For production, replace with a shared store like Redis.
const WINDOW_MS = 60_000
const MAX_REQUESTS_PER_WINDOW = 60
const buckets = new Map<string, Bucket>()

export function rateLimitOrThrow(req: NextRequest) {
  const ip =
    req.ip ??
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown"

  const now = Date.now()
  const current = buckets.get(ip)

  if (!current || now - current.windowStart > WINDOW_MS) {
    buckets.set(ip, { count: 1, windowStart: now })
    return
  }

  current.count += 1

  if (current.count > MAX_REQUESTS_PER_WINDOW) {
    throw new ApiError(429, "RATE_LIMITED", "Too many requests. Please try again in a moment.")
  }
}

