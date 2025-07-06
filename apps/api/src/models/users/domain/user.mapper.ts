import { Prisma } from '@prisma/client';
import { UserEntity } from './user.entity';

import { UUIDFactory } from 'src/common/entities/uuid/uuid.factory';
import { EmailAddressFactory } from 'src/common/entities/email-address/email-address.factory';
import { DomainBaseMapper } from 'src/common/domain/domain.base';

export type RawUser = Prisma.UserGetPayload<{}>;

export class UserMapper extends DomainBaseMapper<UserEntity, RawUser> {
  toDomain(raw: RawUser): UserEntity {
    return new UserEntity(
      UUIDFactory.from(raw.id),
      EmailAddressFactory.from(raw.email),
      raw.isActive,
      raw.createdAt,
      raw.updatedAt,
    );
  }

  toModel(entity: UserEntity) {
    return {
      id: entity.id.value,
      email: entity.email.value,
    };
  }

  static toDomain(raw: RawUser): UserEntity {
    return new UserMapper().toDomain(raw);
  }

  static toModel(entity: UserEntity) {
    return new UserMapper().toModel(entity);
  }
}
