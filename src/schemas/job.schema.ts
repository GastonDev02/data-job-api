/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Types, Document } from 'mongoose';


@Schema({ timestamps: true })
export class Job extends Document {
  @Prop({ required: true })
  jobTitle: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  location: string;

  @Prop({ required: true })
  salary: number;

  @Prop({ required: true })
  company: string;

  @Prop({ required: true, enum: ['', 'Senior', 'SemiSenior', 'Junior', 'Trainee'] })
  seniority: string;

  @Prop({ required: true, enum: ['', 'Web Development', 'Data', 'Design', 'QA', 'Sales & Marketing', 'Management / HR'] })
  category: string;

  @Prop({ required: true, enum: ['', 'full-time', 'part-time'] })
  workday: string;

  @Prop({ required: true, enum: ['', 'remote', 'hybrid', 'in person'] })
  modality: string;

  @Prop()
  companyMail: string;

  @Prop()
  linkedin: string;

  @Prop({ required: true })
  jobImage: string;

  @Prop({ required: true, type: Date })
  posted: Date;   

  @Prop({ required: true })
  country: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  author: Types.ObjectId;
}

export const JobSchema = SchemaFactory.createForClass(Job);
