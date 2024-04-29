/* eslint-disable prettier/prettier */
import { IsString, IsOptional } from 'class-validator';
export class CreatePostDto {
    @IsString()
    postTitle: string;
    @IsString()
    postDescription: string;
    @IsString()
    shortDescription: string;
    @IsOptional()
    postDate: Date;
    @IsString()
    postCategory: string;
    @IsString()
    postImage: string;
}