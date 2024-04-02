/* eslint-disable prettier/prettier */
import { IsString, IsNotEmpty, IsEnum, IsOptional, IsUrl } from 'class-validator';

export class CreateJobDto {
  @IsNotEmpty()
  @IsString()
  jobTitle: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  location: string;

  @IsNotEmpty()
  salary: number;

  @IsNotEmpty()
  @IsString()
  company: string;

  @IsNotEmpty()
  @IsEnum(['', 'Senior', 'SemiSenior', 'Junior', 'Trainee'])
  seniority: string;

  @IsNotEmpty()
  @IsEnum(['', 'Web Development', 'Data', 'Design', 'QA', 'Sales & Marketing', 'Management / HR'])
  category: string;

  @IsNotEmpty()
  @IsEnum(['', 'full-time', 'part-time'])
  workday: string;

  @IsNotEmpty()
  @IsEnum(['', 'remote', 'hybrid', 'in person'])
  modality: string;

  @IsOptional()
  @IsString()
  companyMail: string | null;

  @IsOptional()
  @IsUrl()
  linkedin: string | null;

  @IsNotEmpty()
  @IsString()
  jobImage: string;

  @IsNotEmpty()
  @IsString()
  posted: string | Date;

  @IsNotEmpty()
  @IsString()
  country: string;
}
