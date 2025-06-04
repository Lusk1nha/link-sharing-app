import { Injectable, Logger } from "@nestjs/common";
import { AuthProvidersRepository } from "./auth-providers.repository";
import { UUID } from "src/common/entities/uuid/uuid.entity";
import { AuthProviderModel, AuthProviderType } from "./dto/auth-provider.model";
import { UUIDFactory } from "src/common/entities/uuid/uuid.factory";
import { CreateAuthProviderDto } from "./dto/auth-provider.dto";

@Injectable()
export class AuthProvidersService {
  private readonly logger = new Logger(AuthProvidersService.name);

  constructor(private readonly repository: AuthProvidersRepository) {}

  async getAuthProvidersByUserId(
    userId: UUID,
  ): Promise<AuthProviderModel[] | null> {
    return await this.repository.getByUserId(userId);
  }

  async createAuthProvider(
    userId: UUID,
    payload: CreateAuthProviderDto,
  ): Promise<AuthProviderModel> {
    const id = UUIDFactory.create();
    const type = payload.type;

    const authProvider = await this.repository.create({
      data: {
        id: id.value(),
        user: {
          connect: {
            id: userId.value(),
          },
        },
        type,
      },
    });

    this.logger.log(
      `AuthProvider created | userId=${userId.value()} | type=${type}`,
    );

    return authProvider;
  }
}
