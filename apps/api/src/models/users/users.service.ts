import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/common/database/database.service';
import { EmailAddress } from 'src/common/entities/email-address/email-address.entity';
import { UUID } from 'src/common/entities/uuid/uuid.entity';

import {
  UserAlreadyExistsException,
  UserNotFoundException,
} from './users.errors';
import { UserEntity } from './domain/user.entity';
import { UserMapper } from './domain/user.mapper';
import { PrismaTransaction } from 'src/common/database/__types__/database.types';
import { Prisma } from '@prisma/client';
import { UpdateUserDto } from './dto/update-user.dto';
import { EmailAddressFactory } from 'src/common/entities/email-address/email-address.factory';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Retrieves a user by unique criteria, mapping to domain or returning null.
   */
  private async findUnique(
    where: Prisma.UserWhereUniqueInput,
  ): Promise<UserEntity | null> {
    const record = await this.prisma.user.findUnique({ where });
    return record ? UserMapper.toDomain(record) : null;
  }

  /**
   * Updates a user by unique criteria, mapping to domain or returning null.
   */
  private async updateUnique(
    user: UserEntity,
    tx?: PrismaTransaction,
  ): Promise<UserEntity> {
    const client = this.client(tx);

    const record = await client.user.update({
      where: { id: user.id.value },
      data: {
        email: user.email.value,
      },
    });

    return UserMapper.toDomain(record);
  }

  /**
   * Resolves the Prisma client, using transaction if provided.
   */
  private client(tx?: PrismaTransaction) {
    return tx ?? this.prisma;
  }

  /**
   * Finds a user by email, or returns null if not existing.
   */
  async findByEmail(email: EmailAddress): Promise<UserEntity | null> {
    const user = await this.findUnique({ email: email.value });
    if (user) {
      this.logger.debug(`User found by email=${email.value}`);
    }
    return user;
  }

  /**
   * Finds a user by UUID, or returns null if not existing.
   */
  async findById(id: UUID): Promise<UserEntity | null> {
    const user = await this.findUnique({ id: id.value });
    if (user) {
      this.logger.debug(`User found by id=${id.value}`);
    }
    return user;
  }

  /**
   * Finds a user by email or throws NotFound exception.
   */
  async findByEmailOrThrow(email: EmailAddress): Promise<UserEntity> {
    const user = await this.findByEmail(email);
    if (!user) {
      this.logger.warn(`No user found for email=${email.value}`);
      throw new UserNotFoundException();
    }
    return user;
  }

  /**
   * Finds a user by id or throws NotFound exception.
   */
  async findByIdOrThrow(id: UUID): Promise<UserEntity> {
    const user = await this.findById(id);
    if (!user) {
      this.logger.warn(`No user found for id=${id.value}`);
      throw new UserNotFoundException();
    }
    return user;
  }

  /**
   * Creates a new user. Throws if email is already taken.
   */
  async createUser(
    user: UserEntity,
    tx?: PrismaTransaction,
  ): Promise<UserEntity> {
    const client = this.client(tx);

    this.logger.log(`Attempting to create user email=${user.email.value}`);

    try {
      const record = await client.user.create({
        data: {
          id: user.id.value,
          email: user.email.value,
        },
      });

      this.logger.log(`User created with id=${record.id}`);
      return UserMapper.toDomain(record);
    } catch (err) {
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === 'P2002' &&
        (err.meta?.target as string[]).includes('email')
      ) {
        this.logger.error(
          `Unique constraint failed: email=${user.email.value}`,
        );
        throw new UserAlreadyExistsException();
      }

      this.logger.error(`Error creating user: ${err.message}`);
      throw err;
    }
  }

  async updateUser(id: UUID, dto: UpdateUserDto): Promise<UserEntity> {
    this.logger.log(`Attempting to update user id=${id.value}`);

    return await this.prisma.$transaction(async (tx) => {
      const original = await this.findByIdOrThrow(id);

      const emailVo = dto.email
        ? EmailAddressFactory.from(dto.email)
        : undefined;

      const patched = UserEntity.patch(original, {
        email: emailVo,
      });

      return this.updateUnique(patched, tx);
    });
  }
}
