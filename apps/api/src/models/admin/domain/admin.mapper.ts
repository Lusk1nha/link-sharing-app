import { Prisma } from '@prisma/client';
import { AdminEntity } from './admin.entity';
import { UUIDFactory } from 'src/common/entities/uuid/uuid.factory';

export type RawAdmin = Prisma.AdminGetPayload<{}>;

export class AdminMapper {
  static toDomain(admin: RawAdmin): AdminEntity {
    return new AdminEntity(
      UUIDFactory.from(admin.id),
      UUIDFactory.from(admin.userId),
      admin.createdAt,
      admin.updatedAt,
    );
  }

  static toModel(entity: AdminEntity) {
    return {
      id: entity.id.value,
      userId: entity.userId.value,
      createdAt: entity.createdAt ?? null,
      updatedAt: entity.updatedAt ?? null,
    };
  }
}
