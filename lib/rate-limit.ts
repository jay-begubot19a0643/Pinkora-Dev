import type { NextRequest } from 'next/server';

type RateLimitOptions = { limit: number; windowMs: number };
type RateLimitEntry = { count: number; resetAt: number };
type RateLimitResult = { allowed: boolean; retryAfter: number; remaining: number };

declare global {
  var jverseRateLimitStore: Map<string, RateLimitEntry> | undefined;
}

const store = globalThis.jverseRateLimitStore ?? new Map<string, RateLimitEntry>();
globalThis.jverseRateLimitStore = store;

function getClientAddress(request: NextRequest) {
  const forwarded = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
  return forwarded || request.headers.get('x-real-ip') || 'unknown-client';
}

function prune(now: number) {
  if (store.size < 2_000) return;
  for (const [key, entry] of store) {
    if (entry.resetAt <= now) store.delete(key);
  }
}

export function checkRateLimit(request: NextRequest, scope: string, options: RateLimitOptions, identity?: string | null): RateLimitResult {
  const now = Date.now();
  prune(now);
  const subject = identity?.trim() || getClientAddress(request);
  const key = `${scope}:${subject}`;
  const current = store.get(key);

  if (!current || current.resetAt <= now) {
    store.set(key, { count: 1, resetAt: now + options.windowMs });
    return { allowed: true, retryAfter: 0, remaining: options.limit - 1 };
  }

  if (current.count >= options.limit) {
    return { allowed: false, retryAfter: Math.max(1, Math.ceil((current.resetAt - now) / 1_000)), remaining: 0 };
  }

  current.count += 1;
  return { allowed: true, retryAfter: 0, remaining: options.limit - current.count };
}

export function rateLimitHeaders(result: RateLimitResult) {
  return {
    'X-RateLimit-Remaining': String(result.remaining),
    ...(result.retryAfter ? { 'Retry-After': String(result.retryAfter) } : {}),
  };
}
