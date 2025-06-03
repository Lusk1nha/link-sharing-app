import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString } from "class-validator";

export class RegisterPayloadDto {
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
