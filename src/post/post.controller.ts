/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Param, Post, Res } from '@nestjs/common';
import { PostService } from './post.service';
import { Response } from 'express';
import { CreateCommentDto } from 'src/dto/comment.dto';

@Controller('post')
export class PostController {
    constructor(private postService: PostService) { }


    @Get('/get-posts')
    async getAllPosts(@Res() res: Response) {
        try {
            const posts = await this.postService.getPosts()
            return res.status(200).json({
                message: 'Posts successfully obtained',
                response: posts,
                status: 200,
            })
        } catch (error) {
            const statusCode = error.status || 500;
            return res.status(statusCode).json({
                message: error.message || 'Internal Server Error',
                error: error.name || 'UnknownError',
                status: statusCode,
            });
        }
    }

    @Get('/get-post-id/:postId')
    async getPostById(@Param('postId') postId: string, @Res() res: Response) {
        try {
            const post = await this.postService.getPostById(postId)
            return res.status(200).json({
                message: 'Posts successfully obtained',
                response: post,
                status: 200,
            })
        } catch (error) {
            const statusCode = error.status || 500;
            return res.status(statusCode).json({
                message: error.message || 'Internal Server Error',
                error: error.name || 'UnknownError',
                status: statusCode,
            });
        }
    }

    @Get('/get-post-comments/:postId')
    async getCommentsPost(@Param('postId') postId:string, @Res() res:Response) {
        try {
            const postComments = await this.postService.getPostsComments(postId)
            return res.status(200).json({
                message: 'Posts successfully obtained',
                response: postComments,
                status: 200,
            })
        } catch (error) {
            const statusCode = error.status || 500;
            return res.status(statusCode).json({
                message: error.message || 'Internal Server Error',
                error: error.name || 'UnknownError',
                status: statusCode,
            });
        }
    }

    @Post('/create-comment/:postId')
    async createCommentPost(@Param('postId') postId: string, @Body() newComment: CreateCommentDto , @Res() res: Response) {
        try {
            const postedComment = await this.postService.postComment(postId, newComment)
            return res.status(200).json({
                message: 'Comment successfully posted',
                response: postedComment,
                status: 200,
            })
        } catch (error) {
            const statusCode = error.status || 500;
            return res.status(statusCode).json({
                message: error.message || 'Internal Server Error',
                error: error.name || 'UnknownError',
                status: statusCode,
            });
        }
    }
}
