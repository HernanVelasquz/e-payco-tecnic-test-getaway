import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { AttemptControlRepository } from 'src/user/application';

@Injectable()
export class RedisConfigService implements AttemptControlRepository {
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  async setCache(keyValue: string, valueData: any, duration = 36000) {
    return await this.cacheManager.set(keyValue, valueData, duration);
  }

  async getCache(keyValue: string): Promise<string> {
    return await this.cacheManager.get<string>(keyValue);
  }

  async deleteCache(keyValue: string) {
    await this.cacheManager.del(keyValue);
  }
}
