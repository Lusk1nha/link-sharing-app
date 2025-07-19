import { Inject, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/common/database/database.service';
import { EmailAddress } from 'src/common/entities/email-address/email-address.entity';
import { UUID } from 'src/common/entities/uuid/uuid.entity';

import {
  UserAlreadyExistsException,
  UserNotFoundException,
} from './users.errors';
import { UserEntity } from './domain/user.entity';
import { UsersRepository } from './users.repository';
import { UpdateUserDto } from './dto/update-user.dto';
import { EmailAddressFactory } from 'src/common/entities/email-address/email-address.factory';
import { Prisma } from '@prisma/client';
import { UserMapper } from './domain/user.mapper';
import { PrismaTransaction } from 'src/common/database/__types__/database.types';
import { RABBITMQ_MANAGER } from 'src/common/rabbitmq/domain/rabbitmq.injects';
import { RabbitMQService } from 'src/common/rabbitmq/rabbitmq.service';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly usersRepo: UsersRepository,

    @Inject(RABBITMQ_MANAGER)
    private readonly rabbitMQService: RabbitMQService,
  ) {}

  async findByEmail(email: EmailAddress): Promise<UserEntity | null> {
    const user = await this.usersRepo.findUnique({ email: email.value });
    if (user) this.logger.debug(`User found by email=${email.value}`);
    return user;
  }

  async findById(id: UUID): Promise<UserEntity | null> {
    const user = await this.usersRepo.findUnique({ id: id.value });
    if (user) this.logger.debug(`User found by id=${id.value}`);
    return user;
  }

  async findByEmailOrThrow(email: EmailAddress): Promise<UserEntity> {
    const user = await this.findByEmail(email);
    if (!user) {
      this.logger.warn(`No user found for email=${email.value}`);
      throw new UserNotFoundException();
    }
    return user;
  }

  async findByIdOrThrow(id: UUID): Promise<UserEntity> {
    const user = await this.findById(id);
    if (!user) {
      this.logger.warn(`No user found for id=${id.value}`);
      throw new UserNotFoundException();
    }
    return user;
  }

  async createUser(
    user: UserEntity,
    tx?: PrismaTransaction,
  ): Promise<UserEntity> {
    this.logger.log(`Attempting to create user email=${user.email.value}`);

    try {
      const record = await this.usersRepo.create(user, tx);
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

    return this.prisma.$transaction(async (tx) => {
      const original = await this.findByIdOrThrow(id);

      const emailVo = dto.email
        ? EmailAddressFactory.from(dto.email)
        : undefined;

      const patched = UserEntity.patch(original, { email: emailVo });

      const updated = await this.usersRepo.update(patched, tx);
      return UserMapper.toDomain(updated);
    });
  }

  async deleteUser(id: UUID): Promise<void> {
    this.logger.log(`Attempting to delete user id=${id.value}`);

    await this.prisma.$transaction(async (tx) => {
      await this.findByIdOrThrow(id);
      await this.usersRepo.delete(id, tx);
    });

    this.rabbitMQService.publish('user.deleted', { id: id.value });

    this.logger.log(`User deleted with id=${id.value}`);
  }
}
