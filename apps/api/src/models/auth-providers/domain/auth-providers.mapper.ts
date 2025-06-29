import { Prisma } from '@prisma/client';
import { UUIDFactory } from 'src/common/entities/uuid/uuid.factory';
import { AuthProviderEntity } from './auth-providers.entity';

export type RawAuthProvider = Prisma.AuthProviderGetPayload<{}>;

export class AuthProviderMapper {
  static toDomain(raw: RawAuthProvider) {
    return new AuthProviderEntity(
      UUIDFactory.from(raw.id),
      UUIDFactory.from(raw.userId),
      raw.providerType,
      raw.providerId ? raw.providerId : undefined,
      raw.createdAt,
      raw.updatedAt,
    );
  }

  static toModel(entity: AuthProviderEntity) {
    return {
      id: entity.id.value,
      userId: entity.userId.value,
      providerType: entity.providerType,
      providerId: entity.providerId,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
