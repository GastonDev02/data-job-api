/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCommentDto } from 'src/dto/comment.dto';
import { CreatePostDto } from 'src/dto/create.post.dto';
import { Post } from 'src/schemas/post.schema';
import { UserService } from 'src/user/user.service';

@Injectable()
export class PostService {
    constructor(@InjectModel(Post.name) private postModel: Model<Post>,
        private userService: UserService) { }


    async getPosts() {
        try {
            const allPosts = await this.postModel.find()
            return allPosts;
        } catch (error) {
            throw error;
        }
    }

    async getPostsComments(postId:string) {
        try {
            const post = await this.postModel.findById(postId)
            return post.postComments;
        } catch (error) {
            throw error
        }
    }

    async getPostById(id: string) {
        try {
            const getPost = await this.postModel.findById(id)
            return getPost;
        } catch (error) {
            throw error;
        }
    }

    async createPost(userId: string, newPost: CreatePostDto) {
        try {
            const user = await this.userService.getUser(userId)
            const { postTitle, postDescription, shortDescription, postCategory, postDate, postImage } = newPost;
            const createP = {
                postTitle,
                postDescription,
                shortDescription,
                postAuthor: user.fullname,
                postCategory,
                postDate,
                postImage
            }
            const createNewPost = await this.postModel.create(createP)
            await createNewPost.save()
            return createNewPost;
        } catch (error) {
            throw error;
        }
    }

    async postComment(postId: string, newComment: CreateCommentDto) {
        try {
            const { comment, by, userCommentImage } = newComment;
            const post = await this.postModel.findById(postId)


            const newCommentPost: any = post.postComments.push({
                by,
                comment,
                published: new Date(),
                userCommentImage
            })
            await post.save()
            return newCommentPost;

        } catch (error) {
            console.log(error)
            throw error
        }
    }

}
