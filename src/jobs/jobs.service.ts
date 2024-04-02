/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateJobDto } from 'src/dto/create-job.dto';
import { Job } from 'src/schemas/job.schema';

@Injectable()
export class JobsService {
    constructor(@InjectModel(Job.name) private taskModel: Model<Job>) { }

    getJobs() {
        return this.taskModel.find()
    }

    async getJobByTitle(jobTitle: string) {
        const getById = await this.taskModel.findOne({ jobTitle })
        return getById
    }

    async createJob(job: CreateJobDto) {{
        const createJob = await this.taskModel.create(job)
        await createJob.save()
    }}
}
