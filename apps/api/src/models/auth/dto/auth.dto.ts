import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString } from "class-validator";
import { SessionModel } from "src/models/sessions/dto/sessions.model";
import { UserModel } from "src/models/users/dto/users.model";

export class RegisterPayloadDto {
  @ApiProperty({
    description: "The email address of the user. This must be a unused email.",
    example: "test@example.com",
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: "The password for the user account",
    example: "password123",
  })
  @IsString()
  password: string;
}

export class RegisterResponseDto {
  @ApiProperty({
    description: "The user model after successful registration",
    type: UserModel,
  })
  user: UserModel;
}

export class LoginPayloadDto {
  @ApiProperty({
    description: "The email address of the user",
    example: "test@example.com",
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: "The password for the user account",
    example: "password123",
  })
  @IsString()
  password: string;
}

export class LoginResponseDto {
  @ApiProperty({
    description: "Token for authenticated user",
    type: SessionModel,
  })
  accessToken: SessionModel;
}
