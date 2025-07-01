import { Global, Module } from '@nestjs/common';

import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';

import { SessionsModule } from '../sessions/sessions.module';
import { AdminModule } from '../admin/admin.module';
import { UsersModule } from '../users/users.module';

@Global()
@Module({
  imports: [SessionsModule, UsersModule, AdminModule],
  controllers: [RolesController],
  providers: [RolesService],
  exports: [RolesService],
})
export class RolesModule {}
