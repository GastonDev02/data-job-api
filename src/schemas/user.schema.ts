/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class User extends Document {
  @Prop({ required: true })
  fullname: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  password: string; 

  @Prop({required: false})
  description: string;

  @Prop({required: false})
  phone: number;

  @Prop({required: false})
  imageProfile: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Post' }], default: [] })
  jobSaved: Types.ObjectId[];

  @Prop({required: false})
  location: string;

  @Prop({ required: false, enum: ['user', 'admin', 'company'], default: 'user' })
  role: string;

  @Prop({required: false, default: []})
  skills: string[]
}

export const UserSchema = SchemaFactory.createForClass(User);
