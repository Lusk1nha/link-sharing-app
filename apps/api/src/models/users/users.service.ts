import { Injectable } from "@nestjs/common";
import { UsersRepository } from "./users.repository";
import { UUIDFactory } from "src/common/entities/uuid/uuid.factory";

@Injectable()
export class UsersService {
  constructor(private readonly repository: UsersRepository) {}

  async getUsers() {
    return await this.repository.getUsers({});
  }

  async createUser() {
    const id = UUIDFactory.create();

    return await this.repository.create({
      data: {
        id: id.toString(),
      },
    });
  }
}
