import { Prisma } from '@prisma/client';
import { UserEntity } from './user.entity';

import { UUIDFactory } from 'src/common/entities/uuid/uuid.factory';
import { EmailAddressFactory } from 'src/common/entities/email-address/email-address.factory';

export type RawUser = Prisma.UserGetPayload<{}>;

export class UserMapper {
  static toDomain(raw: RawUser): UserEntity {
    return new UserEntity(
      UUIDFactory.from(raw.id),
      EmailAddressFactory.from(raw.email),
      true,
      raw.createdAt,
      raw.updatedAt,
    );
  }

  static toModel(entity: UserEntity) {
    return {
      id: entity.id.value,
      email: entity.email.value,
    };
  }
}
