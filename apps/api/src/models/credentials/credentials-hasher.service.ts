import { Injectable } from "@nestjs/common";
import { comparePassword, hashPassword } from "src/helpers/hash";

@Injectable()
export class CredentialsHasherService {
  async hash(password: string): Promise<string> {
    return hashPassword(password);
  }

  async compare(password: string, hash: string): Promise<boolean> {
    return comparePassword(password, hash);
  }
}
