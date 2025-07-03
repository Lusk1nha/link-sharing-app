import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class RedisCacheService {
  constructor(@Inject(CACHE_MANAGER) private readonly cache: Cache) {}

  async get<T>(key: string): Promise<T | null> {
    const value = await this.cache.get<T>(key);
    return value ?? null;
  }

  async set<T>(key: string, value: T, ttl?: number): Promise<T> {
    return await this.cache.set(key, value, ttl);
  }

  async del(key: string): Promise<boolean> {
    return await this.cache.del(key);
  }
}
