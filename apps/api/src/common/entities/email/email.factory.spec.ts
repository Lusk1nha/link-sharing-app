import { EmailAddress } from "./email.entity";
import { EmailFactory } from "./email.factory";

import { faker } from "@faker-js/faker";

describe("EmailFactory", () => {
  it("should create a new EmailAddress instance from a valid email string", () => {
    const validEmail = faker.internet.email();

    const email = EmailFactory.from(validEmail);
    expect(email).toBeInstanceOf(EmailAddress);
    expect(email.toString()).toBe(validEmail);
  });

  it("should throw an error when creating an EmailAddress from an invalid email string", () => {
    const invalidEmail = "invalid-email-format";

    expect(() => EmailFactory.from(invalidEmail)).toThrow(
      `Invalid email address format: "${invalidEmail}"`,
    );
  });
});
