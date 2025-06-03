import { CredentialsRepository } from "./credentials.repository";

export class CredentialsService {
  constructor(private readonly repository: CredentialsRepository) {}
}
