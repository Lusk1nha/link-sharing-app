import { Injectable, Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaTransaction } from 'src/common/database/__types__/database.types';
import { PrismaService } from 'src/common/database/database.service';
import { UUID } from 'src/common/entities/uuid/uuid.entity';
import { AdminMapper } from './domain/admin.mapper';
import { AdminEntity } from './domain/admin.entity';
import {
  AdminAlreadyExistsException,
  AdminNotFoundException,
} from './admin.errors';

@Injectable()
export class AdminService {
  private readonly logger = new Logger(AdminService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Retrieves an admin by unique criteria, mapping to domain or returning null.
   */
  private async findUnique(
    where: Prisma.AdminWhereUniqueInput,
  ): Promise<AdminEntity | null> {
    const record = await this.prisma.admin.findUnique({ where });
    return record ? AdminMapper.toDomain(record) : null;
  }

  /**
   * Resolves the Prisma client, using transaction if provided.
   */
  private client(tx?: PrismaTransaction) {
    return tx ?? this.prisma;
  }

  /**
   * Finds an admin by UUID, or returns null if not existing.
   */
  async findByUserId(userId: UUID) {
    const admin = await this.findUnique({ userId: userId.value });
    if (admin) {
      this.logger.debug(`Admin found by userId=${userId.value}`);
    }
    return admin;
  }

  /**
   * Finds an admin by UUID, or throws an exception if not existing.
   */
  async findByUserIdOrThrow(userId: UUID): Promise<AdminEntity> {
    const admin = await this.findByUserId(userId);
    if (!admin) {
      this.logger.error(`Admin not found for userId=${userId.value}`);
      throw new AdminNotFoundException();
    }
    return admin;
  }

  /**
   * Creates a new admin record in the database.
   */
  async createAdmin(
    admin: AdminEntity,
    tx?: PrismaTransaction,
  ): Promise<AdminEntity> {
    const client = this.client(tx);

    this.logger.log(
      `Attempting to create admin for userId=${admin.userId.value}`,
    );

    try {
      const record = await client.admin.create({
        data: {
          id: admin.id.value,
          userId: admin.userId.value,
        },
      });

      this.logger.log(
        `Admin created successfully for userId=${admin.userId.value}`,
      );

      return AdminMapper.toDomain(record);
    } catch (err) {
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === 'P2002' &&
        (err.meta?.target as string[]).includes('userId')
      ) {
        this.logger.error(
          `Admin creation failed: userId=${admin.userId.value} already exists.`,
        );
        throw new AdminAlreadyExistsException();
      }

      this.logger.error(`Error creating admin: ${err.message}`);
      throw err;
    }
  }
}
