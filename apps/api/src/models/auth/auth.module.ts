import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { UsersModule } from "../users/users.module";
import { CredentialsModule } from "../credentials/credentials.module";
import { AuthProvidersModule } from "../auth-providers/auth-providers.module";
import { SessionsModule } from "../sessions/sessions.module";

@Module({
  imports: [
    JwtModule,
    UsersModule,
    CredentialsModule,
    AuthProvidersModule,
    SessionsModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
