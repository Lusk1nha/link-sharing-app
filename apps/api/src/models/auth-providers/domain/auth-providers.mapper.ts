import { Prisma } from '@prisma/client';
import { UUIDFactory } from 'src/common/entities/uuid/uuid.factory';
import { AuthProviderEntity } from './auth-providers.entity';
import { DomainBaseMapper } from 'src/common/domain/domain.base';

export type RawAuthProvider = Prisma.AuthProviderGetPayload<{}>;

export class AuthProviderMapper extends DomainBaseMapper<
  AuthProviderEntity,
  RawAuthProvider
> {
  toDomain(raw: RawAuthProvider) {
    return new AuthProviderEntity(
      UUIDFactory.from(raw.id),
      UUIDFactory.from(raw.userId),
      raw.providerType,
      raw.providerId ? raw.providerId : undefined,
      raw.createdAt,
      raw.updatedAt,
    );
  }

  toModel(entity: AuthProviderEntity) {
    return {
      id: entity.id.value,
      userId: entity.userId.value,
      providerType: entity.providerType,
      providerId: entity.providerId,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }

  static toDomain(raw: RawAuthProvider): AuthProviderEntity {
    return new AuthProviderMapper().toDomain(raw);
  }

  static toModel(entity: AuthProviderEntity) {
    return new AuthProviderMapper().toModel(entity);
  }
}
