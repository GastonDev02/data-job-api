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

    async getJobsByKey(key: string) {
        try {
            const findByKey =  await this.jobModel.find({
                $or: [
                    { jobTitle: { $regex: new RegExp(key, 'i') } },
                    { description: { $regex: new RegExp(key, 'i') } }
                ]
            });
            return findByKey;
        } catch (error) {
            throw error;
        }
    }

    async getLatest() {
        try {
            return await this.jobModel.find().sort({ createdAt: -1 }).limit(10);
        } catch (error) {
            throw error
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

    async createJob(userId: string, job: CreateJobDto) {
        try {
            const newJobData = {
                ...job,
                author: userId
            };
    
            const createJob = await this.jobModel.create(newJobData);
            await createJob.save();
    
            return createJob;
        } catch (error) {
            throw new HttpException(`Interval Server Error: ${error}`, 500);
        }
    }
}
