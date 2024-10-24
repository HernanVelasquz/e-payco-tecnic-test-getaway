import { CacheModule, CacheStore } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { redisStore } from 'cache-manager-redis-yet';
import type { RedisClientOptions } from 'redis';
import { envs } from 'src/config';

@Module({
  imports: [
    CacheModule.registerAsync<RedisClientOptions>({
      useFactory: async () => {
        const store =  await redisStore({
          socket: {
            host: envs.redis.host,
            port: envs.redis.port
          }
        });

        return {
          store: store as CacheStore,
          ttl: envs.redis.ttl,
        }
      },
    }),
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class RedisPersistentStore {}
