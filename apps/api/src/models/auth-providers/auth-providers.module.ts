import { Module } from "@nestjs/common";
import { PrismaModule } from "src/common/prisma/prisma.module";
import { AuthProvidersRepository } from "./auth-providers.repository";
import { AuthProvidersService } from "./auth-providers.service";

@Module({
  imports: [PrismaModule],
  providers: [AuthProvidersRepository, AuthProvidersService],
  exports: [AuthProvidersService],
})
export class AuthProvidersModule {}
