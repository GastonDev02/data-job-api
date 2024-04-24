/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, HttpStatus, NotFoundException, Param, Post, Put, Res } from '@nestjs/common';
import { UserService } from './user.service';
import { AddSkillsDto, ChangeImageDto, ChangeInfoDto, RoleDto } from 'src/dto/user.dto';
import { Response } from 'express';
import { NewPasswordDto } from 'src/dto/new-password.dto';

@Controller('user')
export class UserController {
    constructor(private userService: UserService) { }

    //GET USERS
    @Get('/get-user/:userId')
    async getUserProfile(@Param('userId') userId: string, @Res() res: Response) {
        try {
            const userProfile = await this.userService.getUser(userId)
            return res.status(HttpStatus.OK).json({
                statusCode: 200,
                userProfile
            });
        } catch (error) {
            return res.json({
                error: error.message,
                message: "An error ocurred",
                statusCode: error.status
            });
        }
    }

    @Get('/get-skills/:userId')
    async getUserProfileSkills(@Param('userId') userId: string, @Res() res: Response) {
        const userSkills = await this.userService.getUserSkills(userId);
        return res.json({
            userSkills
        });
    }

    //GET REQUEST JOBS USERS (FOR COMPANIES)
    @Get('/get-user-applicants/:userId')
    async getUserApplicantsJob(@Param('userId') userId: string, @Res() res: Response) {
        try {
            const applicants = await this.userService.getRequestJobs(userId)
            return res.status(200).json({
                message: applicants,
                status: 200,
            })
        } catch (error) {
            return res.status(error.status || 500).json(error)
        }
    }


    @Get('/request-job/:userId/:jobId')
    async userRequestJob(@Param('userId') userId: string, @Param('jobId') jobId: string, @Res() res: Response) {
        try {
            const applies = await this.userService.requestAJob(userId, jobId);
            return res.status(200).json({
                message: 'You have applied correctly',
                applies,
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


    @Delete('/delete-request/:userId/:applicantId')
    async userDeleteRequestJob(@Param('userId') userId: string, @Param('applicantId') applicantId: string, @Res() res: Response) {
        try {
            const deleteApplicant = await this.userService.deleteRequest(userId, applicantId)
            return res.status(200).json({
                message: 'Request deleted correctly',
                update: deleteApplicant,
                status: 200,
            })
        } catch (error) {
            return res.status(error.status).json(error)
        }

    }

    //USER SAVE A JOB
    @Get('/get-saved-jobs/:userId')
    async getUserSavedJobs(@Param('userId') userId: string, @Res() res: Response) {
        try {
            const jobSaved = await this.userService.getSavedJobs(userId)
            return res.status(200).json({
                message: jobSaved,
                status: 200,
            })
        } catch (error) {
            return res.status(error.status || 500).json(error)
        }
    }

    @Post('/save-job/:userId/:jobId')
    async saveJob(@Param('userId') userId: string, @Param('jobId') jobId: string) {
        try {
            await this.userService.save(userId, jobId);
            return {
                message: 'Job saved successfully',
            };
        } catch (error) {
            if (error instanceof NotFoundException) {
                return {
                    message: 'User or job not found',
                    error: error.message
                };
            } else {
                return {
                    message: 'Error saving job',
                    error: error.message
                };
            }
        }
    }

    // USER ROLE
    @Put('/change-role/:userId')
    async changeRole(@Param('userId') userId: string, @Body() newUserRole: RoleDto, @Res() res: Response) {
        try {
            await this.userService.role(userId, newUserRole)
            return res.status(HttpStatus.OK).json({
                statusCode: 200,
                message: "Role changed"
            });

        } catch (error) {
            return res.json({
                error: error.message,
                message: "An error ocurred",
                statusCode: error.status
            });
        }
    }

    //USER INFO
    @Put('/update-info/:userId')
    async updateUserInfo(@Param('userId') userId: string, @Body() newUserInfo: ChangeInfoDto, @Res() res: Response) {
        try {
            const newInfo = await this.userService.updateInfo(userId, newUserInfo)
            return res.status(HttpStatus.OK).json({
                statusCode: 200,
                newInfo
            });
        } catch (error) {
            return res.json({
                error: error.message,
                message: "An error ocurred",
                statusCode: error.status
            });
        }
    }

    //USER IMAGE
    @Put('/update-image/:userId')
    async updateUserImage(@Param('userId') userId: string, @Body() newUserImage: ChangeImageDto, @Res() res: Response) {
        try {
            await this.userService.updateImage(userId, newUserImage)
            return res.status(HttpStatus.OK).json({
                statusCode: 200,
                message: "Role changed"
            });
        } catch (error) {
            return res.json({
                error: error.message,
                message: "An error ocurred",
                statusCode: error.status
            });
        }
    }

    // USER SKILLS
    @Put('/add-skill/:userId')
    async addUserSkill(@Param('userId') userId: string, @Body() newUserSkill: AddSkillsDto, @Res() res: Response) {
        const skillAdd = await this.userService.addSkills(userId, newUserSkill)
        return res.json({
            skillAdd
        });

    }

    //JOB REQUEST
    @Delete('/delete-skill/:userId')
    async deleteIserSkill(@Param('userId') userId: string, @Res() res: Response) {
        const deleteSkillUser = await this.userService.emptySkill(userId)
        return res.json({
            deleteSkillUser
        });
    }

    @Put('/mark-request-view/:userId/:applicantId')
    async markARequestView(@Param('userId') userId: string, @Param('applicantId') applicantId: string, @Res() res: Response){
        try {
            const markAsViewUpdateApplicants = await this.userService.markAsView(userId, applicantId)
            return res.status(200).json({
                message: 'We will notify the user that you have seen their application',
                response: markAsViewUpdateApplicants,
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

    //RECOVER PASSWORD
    @Post('/send-email-recover/:email')
    async sendEmailToRecoverPass(@Param('email') userEmail: string, @Res() res: Response) {
        try {
            await this.userService.sendMailRecover(userEmail)
            return res.status(200).json({
                message: 'The email has been sent. Please check your mailbox',
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

    @Post('/recover-password/:newToken')
    async userRecoverPassword(@Param('newToken') newToken: string, @Body() userNewPass: NewPasswordDto, @Res() res: Response) {
        try {
            await this.userService.recoverPassword(newToken, userNewPass)
            return res.status(200).json({
                message: 'The password has been changed successfully',
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
}
