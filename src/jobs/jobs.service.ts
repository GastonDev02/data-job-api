/* eslint-disable prettier/prettier */
import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateJobDto } from 'src/dto/create-job.dto';
import { Job } from 'src/schemas/job.schema';

@Injectable()
export class JobsService {
    constructor(@InjectModel(Job.name) private jobModel: Model<Job>) { }

    getJobs() {
        try {
            return this.jobModel.find()
        } catch (error) {
            throw new HttpException(`Interval Server Error: ${error}`, 500)
        }

    }

    async getJobById(id: string) {
        try {
            const jobId = await this.jobModel.findById(id);
            return jobId;
        } catch (error) {
            throw new HttpException(`Interval Server Error: ${error}`, 500)
        }
    }

    async getJobByTitle(jobTitle: string) {
        try {
            const getById = await this.jobModel.findOne({ jobTitle })
            return getById;
        } catch (error) {
            throw new HttpException(`Interval Server Error: ${error}`, 500)
        }
    }

    async createJob(job: CreateJobDto) {
        try {
            const createJob = await this.jobModel.create(job)
            await createJob.save()
        } catch (error) {
            throw new HttpException(`Interval Server Error: ${error}`, 500)
        }

    }
}
