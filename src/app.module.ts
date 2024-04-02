/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { JobsModule } from './jobs/jobs.module';
import { MongooseModule } from '@nestjs/mongoose';


@Module({
  imports: [MongooseModule.forRoot(`mongodb+srv://gastonig2024:hvuowsSp4rWNtAn4@datajob.0cdahd9.mongodb.net/`), JobsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
