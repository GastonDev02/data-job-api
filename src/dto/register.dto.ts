/* eslint-disable prettier/prettier */
import { IsString, IsNotEmpty, IsEmail, MinLength } from 'class-validator';

export class RegisterAuthDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(6)
    fullname: string;

    @IsString()
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    password: string;
}
