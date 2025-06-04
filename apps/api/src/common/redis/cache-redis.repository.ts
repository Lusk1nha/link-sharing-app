import { InjectRedis } from '@nestjs-modules/ioredis';
import { Injectable } from '@nestjs/common';
import Redis from 'ioredis';

interface ICacheRedisRepository {
  saveData(key: string, data: string, ttl?: number): Promise<void>;
  addToSet(key: string, member: string): Promise<void>;
  expireKey(key: string, ttl: number): Promise<void>;
  getData<T>(key: string): Promise<T | null>;
  getMembersOfSet(key: string): Promise<string[]>;
  deleteData(key: string): Promise<void>;
}

@Injectable()
export class CacheRedisRepository implements ICacheRedisRepository {
  constructor(@InjectRedis() private readonly client: Redis) {}

  async saveData(key: string, data: string, ttl = 180): Promise<void> {
    await this.client.set(key, data, 'EX', ttl);
  }

  async addToSet(key: string, member: string): Promise<void> {
    await this.client.sadd(key, member);
  }

  async expireKey(key: string, ttl: number): Promise<void> {
    await this.client.expire(key, ttl);
  }

  async getData<T>(key: string): Promise<T | null> {
    const data = await this.client.get(key);

    if (!data) {
      return null;
    }

    return data as T;
  }

  async getMembersOfSet(key: string): Promise<string[]> {
    const members = await this.client.smembers(key);
    return members;
  }

  async deleteData(key: string): Promise<void> {
    await this.client.del(key);
  }
}
