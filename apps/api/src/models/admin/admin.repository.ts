import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/database/database.service';
import { PrismaBaseService } from 'src/common/database/database-base.service';
import { Admin, PrismaClient } from '@prisma/client';
import { UUID } from 'src/common/entities/uuid/uuid.entity';
import { PrismaTransaction } from 'src/common/database/__types__/database.types';
import { AdminEntity } from './domain/admin.entity';
import { AdminMapper } from './domain/admin.mapper';

@Injectable()
export class AdminRepository extends PrismaBaseService<Admin> {
  protected readonly modelName: keyof PrismaClient = 'admin';

  constructor(protected readonly prisma: PrismaService) {
    super(prisma);
  }

  async findByUserId(
    userId: UUID,
    tx?: PrismaTransaction,
  ): Promise<AdminEntity | null> {
    const record = await this.client(tx).admin.findUnique({
      where: { userId: userId.value },
    });

    return record ? AdminMapper.toDomain(record) : null;
  }

  async create(
    admin: AdminEntity,
    tx?: PrismaTransaction,
  ): Promise<AdminEntity> {
    const record = await this.client(tx).admin.create({
      data: {
        id: admin.id.value,
        userId: admin.userId.value,
      },
    });

    return AdminMapper.toDomain(record);
  }
}
