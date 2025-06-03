import { faker } from "@faker-js/faker/.";
import { EmailAddress } from "./email.entity";
import { InvalidEmailException } from "./email.errors";

describe("EmailAddress", () => {
  it("should create a new EmailAddress instance with a valid email", () => {
    const validEmail = faker.internet.email();
    const email = new EmailAddress(validEmail);

    expect(email).toBeInstanceOf(EmailAddress);
    expect(email.toString()).toBe(validEmail);
  });

  it("should throw an error for an invalid email format", () => {
    const invalidEmail = "invalid-email-format";

    expect(() => new EmailAddress(invalidEmail)).toThrow(
      new InvalidEmailException(invalidEmail),
    );
  });
});
