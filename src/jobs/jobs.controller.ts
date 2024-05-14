/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Param, NotFoundException, ConflictException, Res, HttpStatus, Query } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { CreateJobDto } from 'src/dto/create-job.dto';
import { Response } from 'express';

@Controller('jobs')
export class JobsController {
    constructor(private jobService: JobsService) { }


    @Get()
    async getAllJobs() {
        return await this.jobService.getJobs()
    }

    @Get('/get-latest-jobs')
    async getLatestJobs(@Res() res: Response) {
        try {
            const latestJobs = await this.jobService.getLatest()
            return res.status(HttpStatus.OK).json({
                statusCode: 200,
                latestJobs
            });
        } catch (error) {
            return res.json({
                error: error.message,
                message: "An error ocurred",
                statusCode: error.status
            });
        }
    }

    @Get('/search-by-key')
    async searchJobsByKey(@Res() res: Response, @Query('key') key: string) {
        try {
            const searchResults = await this.jobService.getJobsByKey(key);
            return res.status(200).json({
                message: 'You have applied correctly',
                searchResults,
                status: 200,
            });
        } catch (error) {
            const statusCode = error.status || 500;
            return res.status(statusCode).json({
                message: error.message || 'Internal Server Error',
                error: error.name || 'UnknownError',
                status: statusCode,
            });
        }
    }

    @Get(':title')
    async getJobByTitle(@Param('title') title: string) {
        const jobTitle = await this.jobService.getJobByTitle(title)
        if (!jobTitle) throw new NotFoundException('Job does not exist');
        return jobTitle
    }

    @Post('/post-job/:userId')
    async createJob(@Param('userId') userId: string, @Body() body: CreateJobDto) {
        try {
            const createJob = await this.jobService.createJob(userId, body)
            return createJob;
        } catch (error) {
            if (error.code === 11000) {
                throw new ConflictException('Job already exists');
            }
            throw error;
        }

    }
}
