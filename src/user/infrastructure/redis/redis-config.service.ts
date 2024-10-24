import { Inject, Injectable } from "@nestjs/common";
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Cache } from "cache-manager";

@Injectable()
export class RedisConfigService {
    constructor(
        @Inject(
            CACHE_MANAGER
        ) private cacheManager: Cache
    ) {}
}