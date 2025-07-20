import { Injectable, Logger } from '@nestjs/common';
import { UUID } from 'src/common/entities/uuid/uuid.entity';
import { AdminEntity } from './domain/admin.entity';
import {
  AdminAlreadyExistsException,
  AdminNotFoundException,
} from './admin.errors';
import { AdminRepository } from './admin.repository';
import { Prisma } from '@prisma/client';

@Injectable()
export class AdminService {
  private readonly logger = new Logger(AdminService.name);

  constructor(private readonly adminRepo: AdminRepository) {}

  async findByUserId(userId: UUID): Promise<AdminEntity | null> {
    const admin = await this.adminRepo.findByUserId(userId);
    if (admin) {
      this.logger.debug(`Admin found by userId=${userId.value}`);
    }
    return admin;
  }

  async findByUserIdOrThrow(userId: UUID): Promise<AdminEntity> {
    const admin = await this.findByUserId(userId);
    if (!admin) {
      this.logger.error(`Admin not found for userId=${userId.value}`);
      throw new AdminNotFoundException();
    }
    return admin;
  }

  async createAdmin(admin: AdminEntity): Promise<AdminEntity> {
    this.logger.log(
      `Attempting to create admin for userId=${admin.userId.value}`,
    );

    try {
      const created = await this.adminRepo.create(admin);
      this.logger.log(
        `Admin created successfully for userId=${admin.userId.value}`,
      );
      return created;
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
