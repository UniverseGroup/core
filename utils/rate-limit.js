const LRU = require('lru-cache')

const rateLimit = (options) => {
    const tokenCache = new LRU({
        max: 500,
        ttl: parseInt(options.interval || 60000, 10),
        maxSize: 5000,
        sizeCalculation: (value, key) => {
            // return an positive integer which is the size of the item,
            // if a positive integer is not returned, will use 0 as the size.
            return 1
        },
    })

    return {
        check: (res, limit, token) =>
            new Promise((resolve, reject) => {
                const tokenCount = tokenCache.get(token) || [0]
                if (tokenCount[0] === 0) {
                    tokenCache.set(token, tokenCount)
                }
                tokenCount[0] += 1

                const currentUsage = tokenCount[0]
                const isRateLimited = currentUsage >= parseInt(limit, 10)
                res.setHeader('X-RateLimit-Limit', limit)
                res.setHeader(
                    'X-RateLimit-Remaining',
                    isRateLimited ? 0 : limit - currentUsage
                )
                res.setHeader('X-Ratelimit-Reset', isRateLimited ?(tokenCache.getRemainingTTL(token)/1000):0)
                return isRateLimited ? reject() : resolve()
            }),
    }
}

export default rateLimit
