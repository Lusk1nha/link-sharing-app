import { SessionDto } from "../dto/sessions.model";
import { MockUtils } from "@link-sharing-app/mockup-generator/src/utils";

function createSessionMockFactory(): SessionDto {
  return {
    tokenType: "Bearer",
    token:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJhcGkiLCJhdWQiOiJ3ZWIiLCJpYXQiOjE3NDg5OTQyNjEsInN1YiI6IjMxZmE0OWE5LWY0NjItNGFmOC04N2YzLTZlZGRjYzExNDUxOSIsImV4cCI6MTc0ODk5NTE2MX0.yzC_PSOni1v7vWJt91oSz_W4tUJnTIVBsIWJdpFASvo",
    expiresIn: "15m",
  };
}

export function generateSessionMock(length = 0): SessionDto[] {
  return MockUtils.generateMany(createSessionMockFactory, length);
}

export function generateOneSessionMock(data?: Partial<SessionDto>): SessionDto {
  const fakeData = generateSessionMock(1)[0];

  return {
    ...fakeData,
    ...data,
  };
}
