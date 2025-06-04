import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { createHmac } from "crypto";
import { TOKEN_CONFIG_KEYS } from "./sessions.constants";
import { SessionMissingSecretException } from "./dto/sessions.errors";

@Injectable()
export class SessionsHashService {
  constructor(private readonly configService: ConfigService) {}

  generateTokenHash(token: string): string {
    const hmacSecret = this.getSecret(TOKEN_CONFIG_KEYS.HMAC_SECRET);
    return createHmac("sha256", hmacSecret).update(token).digest("hex");
  }

  private getSecret(key: string): string {
    const secret = this.configService.get<string>(key);
    if (!secret) throw new SessionMissingSecretException(key);
    return secret;
  }
}
