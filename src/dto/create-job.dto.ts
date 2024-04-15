/* eslint-disable prettier/prettier */
import { IsString, IsNotEmpty, IsEnum, IsOptional } from 'class-validator';

export class CreateJobDto {
  
  @IsNotEmpty()
  @IsString()
  jobTitle: string;

  @IsNotEmpty()
  @IsString()
  description: string;s

  @IsNotEmpty()
  @IsString()
  location: string;

  @IsOptional()
  salary?: number;

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
  companyMail?: string | null;

  @IsOptional()
  linkedin?: string | null;

  @IsNotEmpty()
  @IsString()
  jobImage: string;

  @IsOptional()
  @IsString()
  posted: string;

  @IsNotEmpty()
  @IsString()
  country: string;
}
