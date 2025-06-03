import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UsersModule } from "./models/users/users.module";
import { CredentialsModule } from "./models/credentials/credentials.module";
import { ConfigModule } from "@nestjs/config";
import { AuthModule } from "./models/auth/auth.module";
import { SessionModule } from "./models/session/session.module";
import { AuthProvidersModule } from "./models/auth-providers/auth-providers.module";

@Module({
  imports: [
    ConfigModule.forRoot(),
    UsersModule,
    CredentialsModule,
    AuthModule,
    SessionModule,
    AuthProvidersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
