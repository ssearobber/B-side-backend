import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({
    example: '31242342',
    description: 'id',
    required: true,
  })
  id: string;

  @ApiProperty({
    example: 'aaa@gmail.com',
    description: 'email',
    required: true,
  })
  email: string;

  @ApiProperty({
    example: 'bisde',
    description: '유저 이름',
    required: true,
  })
  name: string;
}
