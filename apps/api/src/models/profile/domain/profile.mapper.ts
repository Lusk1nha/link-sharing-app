import { Prisma } from '@prisma/client';
import { ProfileEntity } from './profile.entity';
import { UUIDFactory } from 'src/common/entities/uuid/uuid.factory';
import { DomainBaseMapper } from 'src/common/domain/domain.base';

export type RawProfile = Prisma.ProfileGetPayload<{}>;

export class ProfileMapper extends DomainBaseMapper<ProfileEntity, RawProfile> {
  toDomain(raw: RawProfile): ProfileEntity {
    return new ProfileEntity(
      UUIDFactory.from(raw.id),
      UUIDFactory.from(raw.userId),
      raw.firstName,
      raw.lastName,
      raw.imageUrl ? raw.imageUrl : undefined,
      raw.createdAt ? new Date(raw.createdAt) : undefined,
      raw.updatedAt ? new Date(raw.updatedAt) : undefined,
    );
  }

  toModel(entity: ProfileEntity): RawProfile {
    return {
      id: entity.id.value,
      userId: entity.userId.value,
      firstName: entity.firstName,
      lastName: entity.lastName,
      imageUrl: entity.imageUrl || null,
      createdAt: entity.createdAt || new Date(),
      updatedAt: entity.updatedAt || new Date(),
    };
  }

  static toDomain(raw: RawProfile): ProfileEntity {
    return new ProfileMapper().toDomain(raw);
  }

  static toModel(entity: ProfileEntity) {
    return new ProfileMapper().toModel(entity);
  }
}
