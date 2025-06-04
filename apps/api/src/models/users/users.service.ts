import { Injectable, Logger } from "@nestjs/common";
import { UsersRepository } from "./users.repository";
import { UUIDFactory } from "src/common/entities/uuid/uuid.factory";
import { UUID } from "src/common/entities/uuid/uuid.entity";

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(private readonly repository: UsersRepository) {}

  async getUsers() {
    return await this.repository.getUsers({});
  }

  async getUserByIdOrThrow(id: UUID) {
    return await this.repository.getUserByIdOrThrow(id);
  }

  async createUser() {
    const id = UUIDFactory.create();

    const user = await this.repository.create({
      data: {
        id: id.value(),
      },
    });

    this.logger.log(`User created | id=${id.value()}`);

    return user;
  }
}
