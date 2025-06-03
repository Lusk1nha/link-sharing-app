import { Injectable, Logger } from "@nestjs/common";
import { AuthProvidersRepository } from "./auth-providers.repository";
import { UUID } from "src/common/entities/uuid/uuid.entity";
import { AuthProviderModel, AuthProviderType } from "./dto/auth-provider.model";
import { UUIDFactory } from "src/common/entities/uuid/uuid.factory";

@Injectable()
export class AuthProvidersService {
  private readonly logger = new Logger(AuthProvidersService.name);

  constructor(private readonly repository: AuthProvidersRepository) {}

  async getAuthProvidersByUserId(
    userId: UUID,
  ): Promise<AuthProviderModel[] | null> {
    return await this.repository.getByUserId(userId);
  }

  async createAuthProvider(userId: UUID, type: AuthProviderType) {
    const id = UUIDFactory.create();

    const authProvider = await this.repository.create({
      data: {
        id: id.toString(),
        user: {
          connect: {
            id: userId.toString(),
          },
        },
        type,
      },
    });

    this.logger.log(
      `AuthProvider created for user ${userId.toString()} with type ${type}`,
    );

    return authProvider;
  }
}
