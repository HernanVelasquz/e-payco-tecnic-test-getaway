import { CacheModule, CacheStore } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';

import { redisStore } from 'cache-manager-redis-yet';
import type { RedisClientOptions } from 'redis';

import { envs } from '../../../config';
import { AttemptControlRepository } from '../../application/ports/attempt-control.repository';
import { RedisConfigService } from './redis-config.service';
import { RedisAdapterRepository } from './redisAdapter.repository';

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
  providers: [
    RedisConfigService,
    {
      provide: AttemptControlRepository,
      useClass: RedisAdapterRepository,
    }
  ],
  exports: [RedisConfigService, AttemptControlRepository],
})
export class RedisPersistentStore {}
