/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { PostSchema } from 'src/schemas/post.schema';
import { Post } from 'src/schemas/post.schema';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Post.name,
        schema: PostSchema
      }
    ]),
    UserModule
  ],
  providers: [PostService],
  controllers: [PostController],
  exports: [PostService]
})
export class PostModule { }
