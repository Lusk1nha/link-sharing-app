import { Prisma } from '@prisma/client';
import { AdminEntity } from './admin.entity';
import { UUIDFactory } from 'src/common/entities/uuid/uuid.factory';
import { DomainBaseMapper } from 'src/common/domain/domain.base';

export type RawAdmin = Prisma.AdminGetPayload<{}>;

export class AdminMapper extends DomainBaseMapper<AdminEntity, RawAdmin> {
  toDomain(admin: RawAdmin): AdminEntity {
    return new AdminEntity(
      UUIDFactory.from(admin.id),
      UUIDFactory.from(admin.userId),
      admin.createdAt,
      admin.updatedAt,
    );
  }

  toModel(entity: AdminEntity) {
    return {
      id: entity.id.value,
      userId: entity.userId.value,
      createdAt: entity.createdAt ?? null,
      updatedAt: entity.updatedAt ?? null,
    };
  }

  static toDomain(raw: RawAdmin): AdminEntity {
    return new AdminMapper().toDomain(raw);
  }

  static toModel(entity: AdminEntity) {
    return new AdminMapper().toModel(entity);
  }
}
