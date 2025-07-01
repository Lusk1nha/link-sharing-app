import { ApiProperty } from '@nestjs/swagger';

export class DeleteUserResponseDto {
  @ApiProperty({
    description: 'Message indicating the result of the delete operation',
    example: 'User deleted successfully',
  })
  message = 'User deleted successfully';
}
