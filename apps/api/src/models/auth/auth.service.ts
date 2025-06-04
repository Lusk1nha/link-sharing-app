import { Injectable, Logger } from "@nestjs/common";
import { EmailAddress } from "src/common/entities/email/email.entity";
import { UsersService } from "../users/users.service";
import { CredentialsService } from "../credentials/credentials.service";
import { UserModel } from "../users/dto/users.model";
import {
  AuthEmailAlreadyInUseException,
  AuthInvalidCredentialsException,
} from "./dto/auth.errors";
import { AuthProvidersService } from "../auth-providers/auth-providers.service";
import { CredentialModel } from "../credentials/dto/credentials.model";
import { SessionsService } from "../sessions/sessions.service";

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly sessionsService: SessionsService,
    private readonly usersService: UsersService,
    private readonly credentialsService: CredentialsService,
    private readonly authProvidersService: AuthProvidersService,
  ) {}

  async signUp(email: EmailAddress, password: string): Promise<UserModel> {
    await this.validateUniqueEmail(email);

    const user = await this.createUserWithCredentials(email, password);

    const userId = user.id.value();
    const emailStr = email.value();

    this.logger.log(`User registered | email=${emailStr}, id=${userId}`);

    return user;
  }

  async signIn(email: EmailAddress, password: string) {
    const credential = await this.getCredentialByEmail(email);

    await this.validatePassword(credential, password);

    const user = await this.usersService.getUserByIdOrThrow(credential.userId);
    const session = await this.sessionsService.generateTokenByUser(user);

    const userId = user.id.value();
    const emailStr = email.value();

    this.logger.log(`User login | email=${emailStr}, id=${userId}`);

    return session;
  }

  private async createUserWithCredentials(
    email: EmailAddress,
    password: string,
  ): Promise<UserModel> {
    const user = await this.usersService.createUser();
    const type = "CREDENTIALS";

    await Promise.all([
      this.credentialsService.createCredential(user.id, { email, password }),
      this.authProvidersService.createAuthProvider(user.id, { type }),
    ]);

    return user;
  }

  private async getCredentialByEmail(
    email: EmailAddress,
  ): Promise<CredentialModel> {
    const credential =
      await this.credentialsService.getCredentialByEmail(email);

    if (!credential) {
      throw new AuthInvalidCredentialsException();
    }

    return credential;
  }

  private async validatePassword(
    credential: CredentialModel,
    password: string,
  ) {
    const email = credential.email.value();
    const passwordHash = credential.passwordHash;

    const isValid = await this.credentialsService.validatePasswordHash(
      password,
      passwordHash,
    );

    if (!isValid) {
      this.logger.warn(`Invalid password | email=${email}`);
      throw new AuthInvalidCredentialsException();
    }
  }

  private async validateUniqueEmail(email: EmailAddress): Promise<void> {
    const existingUser =
      await this.credentialsService.getCredentialByEmail(email);

    if (existingUser) {
      this.logger.warn(
        `Attempt to register existing email | email=${email.value()}`,
      );
      throw new AuthEmailAlreadyInUseException();
    }
  }
}
