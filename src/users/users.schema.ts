import { Prop, Schema, SchemaFactory, SchemaOptions } from '@nestjs/mongoose';
import { IsEmail, MaxLength } from 'class-validator';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

const options: SchemaOptions = {
  timestamps: true,
  collection: 'user',
};

@Schema(options)
export class User {
  @Prop({ require: true })
  id: string;

  @IsEmail()
  email: string;

  password: string;

  name: string;

  @Prop()
  refreshToken: string;

  readonly readOnlyData: { email: string; name: string };
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.virtual('readOnlyData').get(function (this: User) {
  return {
    email: this.email,
    name: this.name,
  };
});
