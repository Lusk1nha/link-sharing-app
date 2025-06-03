import { faker } from "@faker-js/faker/.";
import { CredentialDto } from "../dto/credentials.model";
import { MockUtils } from "@link-sharing-app/mockup-generator/src/utils";
import { hashPassword } from "src/helpers/hash";

function createCredentialMockFactory(): CredentialDto {
  const updatedAt = faker.date.recent();
  const createdAt = faker.date.past({
    refDate: updatedAt,
    years: 1,
  });

  const passwordHash = hashPassword(faker.word.words(3));

  return {
    id: faker.string.uuid(),
    userId: faker.string.uuid(),
    email: faker.internet.email(),
    passwordHash,
    createdAt,
    updatedAt,
  };
}

export function generateCredentialMock(length = 0): CredentialDto[] {
  return MockUtils.generateMany(createCredentialMockFactory, length);
}
