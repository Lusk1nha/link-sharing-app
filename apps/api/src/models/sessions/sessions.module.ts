import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { SessionsService } from "./sessions.service";
import { SessionsJwtService } from "./sessions-jwt.service";
import { CacheRedisModule } from "src/common/redis/cache-redis.module";
import { SessionsHashService } from "./sessions-hash.service";

@Module({
  imports: [CacheRedisModule, JwtModule, ConfigModule.forRoot()],
  providers: [SessionsHashService, SessionsService, SessionsJwtService],
  exports: [SessionsService],
})
export class SessionsModule {}
