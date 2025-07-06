import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginUserDto {
  @ApiProperty({
    description: 'The email address of the user',
    example: 'example@test.com',
    required: true,
  })
  @IsString({
    message: 'Email must be a string',
  })
  @IsEmail()
  @IsNotEmpty({
    message: 'Email is required',
  })
  email: string;

  @ApiProperty({
    description: 'The password for the user account',
    example: 'StrongPassword123',
    required: true,
  })
  @IsString()
  @IsNotEmpty({
    message: 'Password is required',
  })
  password: string;
}
