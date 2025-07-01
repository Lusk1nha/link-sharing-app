import { Injectable, Logger } from '@nestjs/common';

import { UUID } from 'src/common/entities/uuid/uuid.entity';
import { Role } from 'src/common/roles/roles.common';
import { UsersService } from '../users/users.service';
import { AdminService } from '../admin/admin.service';
import { ROLES_REDIS_KEYS } from './__types__/roles.types';
import { RedisCacheService } from '../redis-cache/redis-cache.service';

const ROLE_EXPIRATION_TTL = 15 * 60; // 15 min em *segundos*

@Injectable()
export class RolesService {
  private readonly logger = new Logger(RolesService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly adminsService: AdminService,
    private readonly redisService: RedisCacheService,
  ) {}

  async getRolesByUserId(userId: UUID): Promise<Role[]> {
    const cacheKey = `${ROLES_REDIS_KEYS.USER_ROLES_PREFIX}${userId.value}`;

    const cached = await this.redisService.get<Role[]>(cacheKey);

    if (cached?.length) {
      this.logger.debug(
        `cache‑hit ➜ user=${userId.value} roles=${cached.join('|')}`,
      );
      return cached;
    }

    const roles = await this.buildUserRoles(userId);

    if (roles.length) {
      await this.redisService.set(cacheKey, roles, ROLE_EXPIRATION_TTL);
      this.logger.debug(
        `cache‑set ➜ user=${userId.value} roles=${roles.join('|')} ttl=${ROLE_EXPIRATION_TTL}s`,
      );
    } else {
      this.logger.warn(`user=${userId.value} does not have any roles`);
    }

    return roles;
  }

  /** Consulta services externos e devolve um *array* de roles sem duplicatas. */
  private async buildUserRoles(userId: UUID): Promise<Role[]> {
    const [user, admin] = await Promise.all([
      this.usersService.findById(userId),
      this.adminsService.findByUserId(userId),
    ]);

    const roles = new Set<Role>();
    if (user) roles.add(Role.User);
    if (admin) roles.add(Role.Admin);

    return [...roles];
  }
}
