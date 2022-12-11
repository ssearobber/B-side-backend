import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class AuthDto2 {
  @ApiProperty({
    example: 'R5cCI6IkpXVCJ9.eyJzdWIiOiI2MzY4NWY4Y',
    description: 'sns access token',
    required: true,
  })
  @IsEmail()
  @IsNotEmpty()
  socialToken: string;

  @ApiProperty({
    example: 'aaa@gmail.com',
    description: 'email',
    required: true,
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'kakao',
    description: 'sns type',
    required: true,
  })
  @IsNotEmpty()
  type: string;
}
