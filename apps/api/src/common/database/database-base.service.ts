import { Injectable } from '@nestjs/common';
import { PrismaTransaction } from './__types__/database.types';
import { PrismaService } from './database.service';
import { PrismaClient } from '@prisma/client';

interface IBaseService {
  client(tx?: PrismaTransaction): PrismaTransaction;
}

@Injectable()
export abstract class PrismaBaseService<T> implements IBaseService {
  protected abstract readonly modelName: keyof PrismaClient;

  constructor(protected readonly prisma: PrismaService) {}

  public client(tx?: PrismaTransaction): PrismaTransaction {
    return tx ?? this.prisma;
  }

  protected get model(): T {
    return this.client()[this.modelName] as unknown as T;
  }
}
