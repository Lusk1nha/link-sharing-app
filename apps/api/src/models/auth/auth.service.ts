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

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly credentialsService: CredentialsService,
    private readonly authProvidersService: AuthProvidersService,
  ) {}

  async signUp(email: EmailAddress, password: string): Promise<UserModel> {
    await this.validateUniqueEmail(email);

    const user = await this.createUserWithCredentials(email, password);

    this.logger.log(
      `User registered with email: ${email.toString()} and ID: ${user.id.toString()}`,
    );

    return user;
  }

  async signIn(email: EmailAddress, password: string) {
    const credential = await this.getCredentialByEmail(email);

    await this.validatePassword(credential.email, password);

    const user = await this.usersService.getUserByIdOrThrow(credential.userId);

    this.logger.log(
      `User signed in with email: ${email.toString()} and ID: ${user.id.toString()}`,
    );

    return {
      user,
    };
  }

  private async createUserWithCredentials(
    email: EmailAddress,
    password: string,
  ): Promise<UserModel> {
    const user = await this.usersService.createUser();

    await Promise.all([
      await this.credentialsService.createCredential(user.id, {
        email,
        password,
      }),
      this.authProvidersService.createAuthProvider(user.id, "CREDENTIALS"),
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

  private async validatePassword(email: EmailAddress, password: string) {
    const isValid = await this.credentialsService.validatePassword(
      email,
      password,
    );

    if (!isValid) {
      this.logger.warn(`Invalid credentials for email: ${email.toString()}`);
      throw new AuthInvalidCredentialsException();
    }
  }

  private async validateUniqueEmail(email: EmailAddress): Promise<void> {
    const existingUser =
      await this.credentialsService.getCredentialByEmail(email);

    if (existingUser) {
      this.logger.warn(
        `Attempt to register with an already used email: ${email.toString()}`,
      );
      throw new AuthEmailAlreadyInUseException();
    }
  }
}
