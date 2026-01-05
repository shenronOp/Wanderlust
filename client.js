import Redis from 'ioredis'

const redis = new Redis(process.env.REDIS_URL)

await redis.set('key', 'ioredis')
const result = await redis.get('key')
console.log(result)