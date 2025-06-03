import { Module } from "@nestjs/common";
import { PrismaModule } from "src/common/prisma/prisma.module";
import { CredentialsRepository } from "./credentials.repository";
import { CredentialsService } from "./credentials.service";

@Module({
  imports: [PrismaModule],
  providers: [CredentialsRepository, CredentialsService],
  exports: [CredentialsService],
})
export class CredentialsModule {}
