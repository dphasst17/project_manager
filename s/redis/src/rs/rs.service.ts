import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';
@Injectable()
export class RsService {
    private redis: Redis
    constructor() {
        this.redis = new Redis({
            host: process.env.REDIS_HOST || 'nest-redis',
            port: 6379,
        })
        this.redis.on('error', (err) => {
          console.error('Redis connection error:', err)
        })
    }
    async redisGet(key: string) {
        const data = await this.redis.get(key)
        return data ? JSON.parse(data) : null
    }
    async redisSet(data: { key: string, value: string }[]) {
      const flattened = data.flatMap(d => [d.key, d.value])
      const result =  await this.redis.mset(...flattened)
      return result
    }
    async redisUpdate(key: string,field:string,value:any) {
      const data = await this.redisGet(key)
      data[field] = value
      return await this.redis.set(key, JSON.stringify(data))
    }
    async redisDel(key: string) {
        const data = await this.redis.del(key)
        return data
    }
}
