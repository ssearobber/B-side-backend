import { Injectable, UnauthorizedException } from '@nestjs/common';

import * as bcrypt from 'bcrypt';

import { UserDocument } from './users.schema';
import { UserRequestDto } from './\bdto/users.request.dto';
import { UsersRepository } from './users.repository';
import { UpdateUserDto } from './\bdto/users.update.dto';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  // async create(userRequestDto: UserRequestDto): Promise<UserDocument> {
  //   const { email, name, password } = userRequestDto;
  //   const isUser = await this.usersRepository.existsByEmail(email);
  //   if (isUser) {
  //     throw new UnauthorizedException('이미 존재하는 email입니다.');
  //   }

  //   const saltOrRounds = 10;
  //   const hashedPassword = await bcrypt.hash(password, saltOrRounds);

  //   const createdUser = await this.usersRepository.create({
  //     email,
  //     name,
  //     password: hashedPassword,
  //   });
  //   return createdUser;
  // }

  async create(createUserDto: UserRequestDto): Promise<UserDocument> {
    const createdUser = await this.usersRepository.create(createUserDto);
    return createdUser;
  }

  async findOneAndUpdate(
    filter: object,
    update: object,
  ): Promise<UserDocument> {
    const updateRefreshToken = await this.usersRepository.findOneAndUpdate(
      filter,
      update,
    );
    return updateRefreshToken;
  }

  async findAll(): Promise<UserDocument[]> {
    return this.usersRepository.findAll();
  }

  async findById(id: string): Promise<UserDocument> {
    return this.usersRepository.findById(id);
  }

  async findByKakaoId(id: string): Promise<UserDocument> {
    return this.usersRepository.findByKakaoId(id);
  }

  async findByRefreshToken(refreshToken: string): Promise<UserDocument> {
    return this.usersRepository.findByRefreshToken(refreshToken);
  }

  async findByUsername(email: string): Promise<UserDocument> {
    return this.usersRepository.findByUsername(email);
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserDocument> {
    return this.usersRepository.update(id, updateUserDto);
  }

  async remove(id: string): Promise<UserDocument> {
    return this.usersRepository.remove(id);
  }
}
