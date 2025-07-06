import { Prisma } from '@prisma/client';
import { CredentialEntity } from './credential.entity';

import { UUIDFactory } from 'src/common/entities/uuid/uuid.factory';
import { DomainBaseMapper } from 'src/common/domain/domain.base';

export type RawCredential = Prisma.CredentialGetPayload<{}>;

export class CredentialMapper extends DomainBaseMapper<
  CredentialEntity,
  RawCredential
> {
  toDomain(raw: RawCredential): CredentialEntity {
    return new CredentialEntity(
      UUIDFactory.from(raw.id),
      UUIDFactory.from(raw.userId),
      raw.passwordHash,
      raw.createdAt,
      raw.updatedAt,
    );
  }

  toModel(entity: CredentialEntity) {
    return {
      id: entity.id.value,
      userId: entity.userId.value,
      password_hash: entity.passwordHash,
    };
  }

  static toDomain(raw: RawCredential): CredentialEntity {
    return new CredentialMapper().toDomain(raw);
  }

  static toModel(entity: CredentialEntity) {
    return new CredentialMapper().toModel(entity);
  }
}
