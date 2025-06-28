import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, IsUrl } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({
    description: 'The user email address',
    example: 'test@example.com',
  })
  @IsEmail()
  @IsOptional()
  email?: string;
}
