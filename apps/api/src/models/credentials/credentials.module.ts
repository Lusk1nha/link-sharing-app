import { Module } from "@nestjs/common";
import { PrismaModule } from "src/common/prisma/prisma.module";
import { CredentialsRepository } from "./credentials.repository";
import { CredentialsService } from "./credentials.service";
import { CredentialsHasherService } from "./credentials-hasher.service";

@Module({
  imports: [PrismaModule],
  providers: [
    CredentialsRepository,
    CredentialsService,
    CredentialsHasherService,
  ],
  exports: [CredentialsService],
})
export class CredentialsModule {}
