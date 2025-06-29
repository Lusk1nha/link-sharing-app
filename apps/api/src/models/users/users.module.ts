import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { PrismaService } from 'src/common/database/database.service';
import { UsersController } from './users.controller';
import { RolesService } from '../roles/roles.service';
import { AdminService } from '../admin/admin.service';

import { SessionsCacheService } from '../sessions-cache/sessions-cache.service';
import { SessionsService } from '../sessions/sessions.service';
import { TokenService } from '../token/token.service';
import { HashService } from '../hash/hash.service';

@Module({
  controllers: [UsersController],
  providers: [
    UsersService,
    PrismaService,
    RolesService,
    AdminService,
    SessionsService,
    TokenService,
    SessionsCacheService,
    HashService,
  ],
})
export class UsersModule {}
