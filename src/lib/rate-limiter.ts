import { redis } from '@/lib/redis'
import { Ratelimit } from '@upstash/ratelimit'

export const rateLimiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(4, '10 s'),
    /**
     * Optional prefix for the keys used in redis. This is useful if you want to share a redis
     * instance with other applications and want to avoid key collisions. The default prefix is
     * "@upstash/ratelimit"
     */
    prefix: '@upstash/ratelimit',
})