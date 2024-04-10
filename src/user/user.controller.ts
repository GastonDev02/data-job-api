/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, HttpStatus, NotFoundException, Param, Post, Put, Res } from '@nestjs/common';
import { UserService } from './user.service';
import { AddSkillsDto, ChangeImageDto, ChangeInfoDto, RoleDto } from 'src/dto/user.dto';
import { Response } from 'express';

@Controller('user')
export class UserController {
    constructor(private userService: UserService) { }

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

    @Put('/add-skill/:userId')
    async addUserSkill(@Param('userId') userId: string, @Body() newUserSkill: AddSkillsDto, @Res() res: Response) {
        const skillAdd = await this.userService.addSkills(userId, newUserSkill)
        return res.json({
            skillAdd
        });

    }

    @Delete('/delete-skill/:userId')
    async deleteIserSkill(@Param('userId') userId: string, @Res() res: Response) {
        const deleteSkillUser = await this.userService.emptySkill(userId)
        return res.json({
            deleteSkillUser
        });
    }
}
