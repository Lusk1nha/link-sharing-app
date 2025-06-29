import { Injectable, Logger } from '@nestjs/common';

import { UUID } from 'src/common/entities/uuid/uuid.entity';
import { Role } from 'src/common/roles/roles.common';
import { UsersService } from '../users/users.service';
import { AdminService } from '../admin/admin.service';

@Injectable()
export class RolesService {
  private readonly logger = new Logger(RolesService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly adminsService: AdminService,
  ) {}

  async getRolesByUserId(userId: UUID): Promise<Role[]> {
    const roles: Role[] = [];

    const [user, admin] = await Promise.all([
      this.usersService.findById(userId),
      this.adminsService.findByUserId(userId),
    ]);

    if (user) {
      roles.push(Role.User);
    }

    if (admin) {
      roles.push(Role.Admin);
    }

    if (roles.length === 0) {
      return [];
    }

    this.logger.log(`User with ID ${userId} has roles: ${roles.join(', ')}`);
    return roles;
  }
}
