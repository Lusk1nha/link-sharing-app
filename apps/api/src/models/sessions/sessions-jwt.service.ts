import { Injectable } from "@nestjs/common";
import { UserModel } from "../users/dto/users.model";
import { CreateUserAuthType } from "src/common/types";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { SessionModel, TokenType } from "./dto/sessions.model";
import { TOKEN_CONFIG_KEYS, TOKEN_TYPES } from "./sessions.constants";
import { SessionMissingSecretException } from "./dto/sessions.errors";

@Injectable()
export class SessionsJwtService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async createToken(user: UserModel, type: TokenType): Promise<SessionModel> {
    const secretKey =
      type === TOKEN_TYPES.ACCESS
        ? TOKEN_CONFIG_KEYS.SECRET
        : TOKEN_CONFIG_KEYS.REFRESH_SECRET;

    const expiresIn = type === TOKEN_TYPES.ACCESS ? "15m" : "7d";
    const payload = this.createJWTPayload(user);
    const token = await this.jwtService.signAsync(payload, {
      secret: this.getSecret(secretKey),
      expiresIn,
      algorithm: "HS256",
    });

    return {
      tokenType: "Bearer",
      token,
      expiresIn,
    };
  }

  private createJWTPayload(user: UserModel): CreateUserAuthType {
    const userId = user.id.value();

    const payload: CreateUserAuthType = {
      iss: "api",
      aud: "web",
      iat: Math.floor(Date.now() / 1000),
      sub: userId,
    };

    return payload;
  }

  private getSecret(key: string): string {
    const secret = this.configService.get<string>(key);
    if (!secret) throw new SessionMissingSecretException(key);
    return secret;
  }
}
