/* eslint-disable prettier/prettier */
import { IsString, IsNotEmpty } from 'class-validator';
export class CreateCommentDto {
    @IsNotEmpty()
    @IsString()
    comment: string;

    by: string;
    userCommentImage: string;
  }