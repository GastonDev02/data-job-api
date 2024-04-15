/* eslint-disable prettier/prettier */
import { IsString, IsNotEmpty } from 'class-validator';

export class NewPasswordDto {
    @IsString()
    @IsNotEmpty()
    newPassword: string;
}
