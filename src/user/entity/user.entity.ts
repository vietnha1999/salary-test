import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { UserType } from '../user.type';

export type UserDocument = mongoose.HydratedDocument<User>;

@Schema({
  versionKey: false,
  timestamps: false,
})
export class User {
  @Prop({ type: mongoose.Schema.Types.Number, enum: UserType })
  type: UserType;

  @Prop({ type: mongoose.Schema.Types.Number })
  salary: number;

  @Prop({ type: mongoose.Schema.Types.Number })
  balance: number;

  @Prop({ type: mongoose.Schema.Types.Number })
  v: number;

  @Prop({ type: mongoose.Schema.Types.Date })
  createdAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
