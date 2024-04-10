/* eslint-disable prettier/prettier */
import { IsString, IsNotEmpty, IsMongoId, IsArray, IsEnum, IsNumber, ArrayMinSize } from 'class-validator';
import { Types } from 'mongoose';

export class UserDto {
    @IsMongoId()
    _id: string

    @IsString()
    @IsNotEmpty()
    email: string

    @IsEnum(['user', 'admin', 'company'])
    role: string;

    @IsArray()
    jobSaved: Types.ObjectId[]

    @IsArray()
    skills: string[]

    @IsString()
    fullname: string;

    @IsString()
    location: string;

    @IsNumber()
    phone: number;

    @IsString()
    description: string;

    @IsString()
    imageProfile: string;
}

export class RoleDto {
    @IsEnum(['user', 'admin', 'company'])
    role: string;
}

export class ChangeInfoDto {
    fullname: string;
    location: string;
    email: string;
    phone: number;
    description: string;
}

export class ChangeImageDto {
    @IsString()
    imageProfile: string;
}

export class AddSkillsDto {
    @ArrayMinSize(1)
    @IsString({ each: true })
    skills: string[];
  }
