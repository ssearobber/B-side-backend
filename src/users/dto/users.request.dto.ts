import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class UserRequestDto {
  @ApiProperty({
    example: '12341',
    description: 'sns id',
    required: true,
  })
  @IsNotEmpty()
  id: string;

  @ApiProperty({
    example: 'aaa@gmail.com',
    description: 'email',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'bside123!',
    description: 'password',
  })
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    example: 'bisde',
    description: '유저 이름',
  })
  @IsNotEmpty()
  name: string;

  // @ApiProperty({
  //   example: 'Ci8UJHre14Xy6DS1f.GZANu1WnM7BNgIjGiSq6zP.Eq9pq6nB7oIJwjlthiFbnz',
  //   description: 'refresh token',
  // })
  refreshToken: string;
}
