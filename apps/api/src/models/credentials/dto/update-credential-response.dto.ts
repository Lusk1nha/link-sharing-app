import { ApiProperty } from '@nestjs/swagger';

export class UpdateCredentialResponseDto {
  @ApiProperty({
    description: 'Message indicating the result of the update operation',
    example: 'Credentials updated successfully',
    required: true,
  })
  message: 'Credentials updated successfully';
}
