/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Param, NotFoundException, ConflictException } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { CreateJobDto } from 'src/dto/create-job.dto';

@Controller('jobs')
export class JobsController {
    constructor(private jobService: JobsService) { }


    @Get()
    async getAllJobs() {
        return await this.jobService.getJobs()
    }

    @Get(':title')
    async getJobByTitle(@Param('title') title: string) {
        const jobTitle = await this.jobService.getJobByTitle(title)
        if (!jobTitle) throw new NotFoundException('Job does not exist');
        return jobTitle
    }

    @Post()
    async createJob(@Body() body: CreateJobDto) {
        try {
            const createJob = await this.jobService.createJob(body)
            return createJob;
        } catch (error) {
            if (error.code === 11000) {
                throw new ConflictException('Job already exists');
            }
            throw error;
        }

    }
}
