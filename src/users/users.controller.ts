import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Param,
  Patch,
  Post,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { HttpExceptionFilter } from 'src/common/exceptions/http-exception.filter';
import { LoggingInterceptor } from 'src/common/interceptors/logging.interceptor';
import { ValidationPipe } from 'src/common/pipes/validation.pipe';
import { AccessTokenGuard } from '../common/guards/accessToken.guard';
import { UserRequestDto } from './\bdto/users.request.dto';
import { UserResponseDto } from './\bdto/users.response.dto';
import { UpdateUserDto } from './\bdto/users.update.dto';
import { UsersService } from './users.service';

@Controller('users')
@UseInterceptors(LoggingInterceptor)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // @ApiOperation({ summary: '회원가입' })
  // @ApiResponse({
  //   status: 500,
  //   description: 'Server Error',
  // })
  // @ApiResponse({
  //   status: 200,
  //   description: 'success',
  //   type: UserResponseDto,
  // })
  // @Post('signUp')
  // async signUp(@Body() body: UserRequestDto) {
  //   return await this.usersService.create(body);
  // }

  // @ApiOperation({ summary: '로그인' })
  // @Post()
  // @UseFilters(HttpExceptionFilter)
  // signIn(): string {
  //   throw new HttpException('test error', 401);
  //   return 'test';
  // }

  // @ApiOperation({ summary: '로그아웃' })
  // @Post()
  // logOut() {
  //   return 'logOut';
  // }
  // @ApiOperation({ summary: '인증' })
  // @Get(':id')
  // getCurrentUser(@Param('id', ValidationPipe) param: string): string {
  //   console.log(param);
  //   console.log(typeof param);
  //   return 'test';
  // }
  @Post()
  create(@Body() createUserDto: UserRequestDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @UseGuards(AccessTokenGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @UseGuards(AccessTokenGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
