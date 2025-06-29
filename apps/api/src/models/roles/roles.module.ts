import { Module } from '@nestjs/common';

import { RolesService } from './roles.service';
import { AdminService } from '../admin/admin.service';
import { UsersService } from '../users/users.service';
import { RolesController } from './roles.controller';
import { PrismaService } from 'src/common/database/database.service';

import { SessionsCacheService } from '../sessions-cache/sessions-cache.service';
import { SessionsService } from '../sessions/sessions.service';
import { TokenService } from '../token/token.service';
import { HashService } from '../hash/hash.service';

@Module({
  controllers: [RolesController],
  providers: [
    RolesService,
    AdminService,
    UsersService,
    PrismaService,
    SessionsService,
    TokenService,
    SessionsCacheService,
    HashService,
  ],
})
export class RolesModule {}
