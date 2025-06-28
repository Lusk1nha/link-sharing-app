import * as Joi from 'joi';
import configuration from '../common/configuration/configuration.common';

import { Module } from '@nestjs/common';

import { UsersModule } from '../models/users/users.module';
import { ConfigModule } from '@nestjs/config';

import { PrismaService } from '../common/database/database.service';
import { CredentialsModule } from '../models/credentials/credentials.module';
import { PasswordModule } from 'src/models/password/password.module';
import { AuthModule } from 'src/models/auth/auth.module';
import { SessionsModule } from 'src/models/sessions/sessions.module';
import { HashModule } from 'src/models/hash/hash.module';
import { TokenModule } from 'src/models/token/token.module';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-store';
import { SessionsCacheModule } from 'src/models/sessions-cache/sessions-cache.module';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { HealthModule } from 'src/models/health/health.module';
import { MemoryUsageModule } from 'src/models/memory-usage/memory-usage.module';
import { AdminModule } from 'src/models/admin/admin.module';

const validationSchema = Joi.object({
  APP_PORT: Joi.number().integer().positive().default(3000),
  DATABASE_URL: Joi.string().required(),
});

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [configuration],
      validationSchema,
    }),
    CacheModule.register({
      isGlobal: true,
      store: redisStore,
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
    }),

    HealthModule,
    MemoryUsageModule,
    UsersModule,
    CredentialsModule,
    PasswordModule,
    AuthModule,
    SessionsModule,
    SessionsCacheModule,
    HashModule,
    TokenModule,
    AdminModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
