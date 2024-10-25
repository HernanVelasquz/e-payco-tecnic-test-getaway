import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class RedisConfigService {
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  async setCache(keyValue: string, valueData: any, duration = 3600) {
    return await this.cacheManager.set(keyValue, valueData, duration);
  }

  async getCache(keyValue: string): Promise<string> {
    return await this.cacheManager.get(keyValue);
  }

  async deleteCache(keyValue: string) {
    await this.cacheManager.del(keyValue);
  }
}
