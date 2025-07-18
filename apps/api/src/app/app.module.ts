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

import { SessionsCacheModule } from 'src/models/sessions-cache/sessions-cache.module';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { HealthModule } from 'src/models/health/health.module';
import { MemoryUsageModule } from 'src/models/memory-usage/memory-usage.module';
import { AdminModule } from 'src/models/admin/admin.module';
import { AuthProviderModule } from 'src/models/auth-providers/auth-providers.module';
import { RolesModule } from 'src/models/roles/roles.module';

import { RedisCacheModule } from 'src/models/redis-cache/redis-cache.module';
import { JwtModule } from '@nestjs/jwt';
import tokenConstants from 'src/models/token/token.constants';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-store';
import { ProfileModule } from 'src/models/profile/profile.module';

import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

const validationSchema = Joi.object({
  APP_PORT: Joi.number().integer().positive().default(3000),
  DATABASE_URL: Joi.string().required(),
});

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validationSchema,
    }),
    JwtModule.register({
      global: true,
      secret: tokenConstants().secret,
      signOptions: { expiresIn: '60s' },
    }),
    CacheModule.register({
      isGlobal: true,
      store: redisStore,
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
    }),
    MailerModule.forRootAsync({
      useFactory: () => ({
        transport: {
          host: process.env.SMTP_HOST,
          port: +process.env.SMTP_PORT!,
          secure: false,
          tls: {
            rejectUnauthorized: false,
          },
        },

        defaults: {
          from: process.env.SMTP_FROM || 'noreply@example.com',
        },

        template: {
          dir: process.cwd() + '/src/templates',
          adapter: new HandlebarsAdapter(),
          options: {
            strict: false,
          },
        },
      }),
    }),

    RedisCacheModule,

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
    AuthProviderModule,
    RolesModule,
    ProfileModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
