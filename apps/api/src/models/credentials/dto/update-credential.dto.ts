import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateCredentialDto {
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
