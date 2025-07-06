import { PrismaClient } from '@prisma/client';
import { PrismaBaseService } from '../database-base.service';
import { PrismaService } from '../database.service';

describe(PrismaBaseService.name, () => {
  class TestService extends PrismaBaseService<any> {
    protected readonly modelName: keyof PrismaClient = 'user';
  }

  let service: TestService;
  let prismaService: PrismaService;

  beforeEach(() => {
    prismaService = { user: { findMany: jest.fn() } } as any;
    service = new TestService(prismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(prismaService).toBeDefined();
  });

  it('should return prisma client if no transaction is provided', () => {
    expect(service.client()).toBe(prismaService);
  });

  it('should return transaction if provided', () => {
    const tx = { user: { findMany: jest.fn() } };
    expect(service.client(tx as any)).toBe(tx);
  });

  it('should return the correct model from prisma client', () => {
    expect(service['model']).toBe(prismaService.user);
  });

  it('should return the correct model from transaction', () => {
    const tx = { user: { findMany: jest.fn() } };

    service.client = jest.fn().mockReturnValue(tx);
    expect(service['model']).toBe(tx.user);
  });
});
