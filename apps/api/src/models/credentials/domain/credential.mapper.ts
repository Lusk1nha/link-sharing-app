import { Prisma } from '@prisma/client';
import { CredentialEntity } from './credential.entity';
import { UUID } from 'src/common/entities/uuid/uuid.entity';

export type RawCredential = Prisma.CredentialGetPayload<{}>;

export class CredentialMapper {
  static toDomain(raw: RawCredential): CredentialEntity {
    return new CredentialEntity(
      new UUID(raw.id),
      new UUID(raw.userId),
      raw.passwordHash,
      raw.createdAt,
      raw.updatedAt,
    );
  }

  static toModel(entity: CredentialEntity) {
    return {
      id: entity.id.value,
      userId: entity.userId.value,
      password_hash: entity.passwordHash,
    };
  }
}
