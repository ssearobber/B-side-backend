import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiHeader,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { Request } from 'express';
import { AccessTokenGuard } from '../common/guards/accessToken.guard';
import { RefreshTokenGuard } from '../common/guards/refreshToken.guard';
import { LoggingInterceptor } from '../common/interceptors/logging.interceptor';
import { AuthService } from './auth.service';
import { AuthDto2 } from './dto/auth.request2.dto';

@Controller('auth')
@UseInterceptors(LoggingInterceptor)
export class AuthController {
  constructor(private authService: AuthService) {}

  // @ApiOperation({ summary: '회원가입' })
  // @ApiResponse({
  //   status: 500,
  //   description: 'Server Error',
  // })
  // @ApiResponse({
  //   status: 403,
  //   description: 'email already exists',
  // })
  // @ApiResponse({
  //   status: 200,
  //   description: 'success',
  // })
  // @Post('signup')
  // signup(@Body() createUserDto: UserRequestDto) {
  //   return this.authService.signUp(createUserDto);
  // }

  // @ApiOperation({ summary: '로그인' })
  // @ApiResponse({
  //   status: 500,
  //   description: 'Server Error',
  // })
  // @ApiResponse({
  //   status: 400,
  //   description: 'User does not exist , Password is incorrect',
  // })
  // @ApiResponse({
  //   status: 200,
  //   description: 'success',
  // })
  // @Post('signin')
  // signin(@Body() data: AuthDto) {
  //   return this.authService.signIn(data);
  // }

  // @ApiOperation({ summary: 'refreshToken을 재발급' })
  // @ApiBearerAuth('access-token')
  // @ApiResponse({
  //   status: 500,
  //   description: 'Server Error',
  // })
  // @ApiResponse({
  //   status: 200,
  //   description: 'success',
  // })
  // @UseGuards(RefreshTokenGuard)
  // @Get('refresh')
  // refreshTokens(@Req() req: Request) {
  //   const userId = req.user['sub'];
  //   const refreshToken = req.user['refreshToken'];
  //   return this.authService.refreshTokens(userId, refreshToken);
  // }

  // @ApiOperation({ summary: '로그아웃' })
  // @ApiBearerAuth('access-token')
  // @ApiResponse({
  //   status: 500,
  //   description: 'Server Error',
  // })
  // @ApiResponse({
  //   status: 200,
  //   description: 'success',
  // })
  // @UseGuards(AccessTokenGuard)
  // @Get('logout')
  // logout(@Req() req: Request) {
  //   this.authService.logout(req.user['sub']);
  // }

  @ApiOperation({ summary: '로그인' })
  @ApiResponse({
    status: 500,
    description: 'Server Error',
  })
  @ApiResponse({
    status: 400,
    description: 'Client Error',
  })
  @ApiResponse({
    status: 200,
    description: 'success',
  })
  @Post('login')
  login(@Body() data: AuthDto2) {
    return this.authService.login(data);
  }

  @ApiOperation({ summary: 'accessToken을 재발급' })
  // @ApiBearerAuth('access-token')
  @ApiResponse({
    status: 500,
    description: 'Server Error',
  })
  @ApiResponse({
    status: 200,
    description: 'success',
  })
  // @UseGuards(RefreshTokenGuard)
  @Post('accesstoken')
  accessToken(@Req() req: Request) {
    const refreshToken = req.headers.authorization;
    return this.authService.getAccessTokenByRefreshToken(refreshToken);
  }
}
