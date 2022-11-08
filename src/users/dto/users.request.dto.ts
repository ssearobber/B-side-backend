import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class UserRequestDto {
  @ApiProperty({
    example: 'aaa@gmail.com',
    description: 'email',
    required: true,
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'bside123!',
    description: 'password',
    required: true,
  })
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    example: 'bisde',
    description: '유저 이름',
    required: true,
  })
  @IsNotEmpty()
  name: string;

  // @ApiProperty({
  //   example: 'Ci8UJHre14Xy6DS1f.GZANu1WnM7BNgIjGiSq6zP.Eq9pq6nB7oIJwjlthiFbnz',
  //   description: 'refresh token',
  // })
  refreshToken: string;
}
