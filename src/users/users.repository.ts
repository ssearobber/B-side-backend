import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserRequestDto } from './\bdto/users.request.dto';
import { UpdateUserDto } from './\bdto/users.update.dto';

import { User, UserDocument } from './users.schema';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  async existsByEmail(email: string) {
    try {
      const result = await this.userModel.exists({ email });
      return result;
    } catch (error) {
      throw new HttpException('디비 에러', 500);
    }
  }

  async create(user: UserRequestDto) {
    return await this.userModel.create(user);
  }

  async findOneAndUpdate(filter: object, update: object) {
    return await this.userModel.findOneAndUpdate(filter, update, {
      news: true,
    });
  }

  async findAll(): Promise<UserDocument[]> {
    return this.userModel.find().exec();
  }

  async findById(id: string): Promise<UserDocument> {
    return this.userModel.findById(id);
  }

  async findByUserId(type: string, email: string): Promise<UserDocument> {
    return this.userModel.findOne({ type, email }).exec();
  }
  async findByRefreshToken(refreshToken: string): Promise<UserDocument> {
    return this.userModel.findOne({ refreshToken }).exec();
  }

  async findByUsername(email: string): Promise<UserDocument> {
    return this.userModel.findOne({ email }).exec();
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserDocument> {
    return this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .exec();
  }

  async remove(id: string): Promise<UserDocument> {
    return this.userModel.findByIdAndDelete(id).exec();
  }
}
