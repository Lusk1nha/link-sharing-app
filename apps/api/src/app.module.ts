import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { UsersModule } from "./models/users/users.module";
import { CredentialsModule } from "./models/credentials/credentials.module";
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [ConfigModule.forRoot(), UsersModule, CredentialsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
