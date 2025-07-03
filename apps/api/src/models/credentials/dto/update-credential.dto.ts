import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsStrongPassword } from 'class-validator';

export class UpdateCredentialDto {
  @ApiProperty({
    description: 'The password for the user account',
    example: 'StrongPassword123',
    required: true,
  })
  @IsString()
  @IsStrongPassword(
    {},
    {
      message:
        'Password must be a strong password with at least 8 characters, including uppercase, lowercase, numbers, and symbols.',
    },
  )
  @IsNotEmpty({
    message: 'Password is required',
  })
  password: string;
}
