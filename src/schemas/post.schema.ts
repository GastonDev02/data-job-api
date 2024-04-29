/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Post extends Document {
    @Prop({ required: true })
    postTitle: string;

    @Prop({ required: true })
    postDescription: string;

    @Prop( {required: true} )
    shortDescription: string;

    @Prop({ required: true })
    postAuthor: string;

    @Prop({
        type: [{
            by: { type: String, required: true },
            comment: { type: String, required: true },
            userCommentImage: { type: String, required: true },
            published: { type: Date, required: false, default: Date.now }
        }],
        default: []
    })
    postComments: { by: string; comment: string; userCommentImage:string; published: Date }[];

    @Prop({ required: true })
    postDate: Date;

    @Prop({ required: true })
    postCategory: string;

    @Prop({ required: true })
    postImage: string;
}

export const PostSchema = SchemaFactory.createForClass(Post);
