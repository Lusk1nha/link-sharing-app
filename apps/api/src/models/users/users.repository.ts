import { Injectable } from '@nestjs/common';
import { PrismaBaseService } from 'src/common/database/database-base.service';
import { PrismaService } from 'src/common/database/database.service';

import { User, Prisma, PrismaClient } from '@prisma/client';
import { PrismaTransaction } from 'src/common/database/__types__/database.types';
import { UUID } from 'src/common/entities/uuid/uuid.entity';

import { UserEntity } from './domain/user.entity';
import { UserMapper } from './domain/user.mapper';

@Injectable()
export class UsersRepository extends PrismaBaseService<User> {
  protected readonly modelName: keyof PrismaClient = 'user';

  constructor(protected readonly prisma: PrismaService) {
    super(prisma);
  }

  async findUnique(
    where: Prisma.UserWhereUniqueInput,
    tx?: PrismaTransaction,
  ): Promise<UserEntity | null> {
    const user = await this.client(tx).user.findUnique({ where });
    return user ? UserMapper.toDomain(user) : null;
  }

  async create(user: UserEntity, tx?: PrismaTransaction): Promise<User> {
    return this.client(tx).user.create({
      data: {
        id: user.id.value,
        email: user.email.value,
      },
    });
  }

  async update(user: UserEntity, tx?: PrismaTransaction): Promise<User> {
    return this.client(tx).user.update({
      where: { id: user.id.value },
      data: { email: user.email.value },
    });
  }

  async delete(id: UUID, tx?: PrismaTransaction): Promise<User> {
    return this.client(tx).user.delete({
      where: { id: id.value },
    });
  }
}
