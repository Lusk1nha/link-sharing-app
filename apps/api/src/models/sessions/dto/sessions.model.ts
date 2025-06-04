import { ApiProperty } from "@nestjs/swagger";
import { TOKEN_TYPES } from "../sessions.constants";

export type TokenType = (typeof TOKEN_TYPES)[keyof typeof TOKEN_TYPES];

export interface SessionDto {
  tokenType: string;
  token: string;
  expiresIn: string | number;
}

export class SessionModel {
  @ApiProperty({
    description: "The type of the token, typically 'Bearer'",
    example: "Bearer",
    type: String,
  })
  readonly tokenType: string;

  @ApiProperty({
    description: "The JWT token string",
    example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    type: String,
  })
  readonly token: string;

  @ApiProperty({
    description: "The duration for which the token is valid",
    example: "15m",
    type: String,
  })
  readonly expiresIn: string | number;

  constructor(data: SessionDto) {
    this.tokenType = data.tokenType;
    this.token = data.token;
    this.expiresIn = data.expiresIn;
  }
}
