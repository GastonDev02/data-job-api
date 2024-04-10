/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AddSkillsDto, ChangeImageDto, ChangeInfoDto, RoleDto, UserDto } from 'src/dto/user.dto';
import { JobsService } from 'src/jobs/jobs.service';
import { User } from 'src/schemas/user.schema';

@Injectable()
export class UserService {
    constructor(@InjectModel(User.name) private userModel: Model<User>,
        private jobService: JobsService) { }

    async getUser(userId: string) {
        const user = await this.userModel.findById(userId);
        if (!user) {
            throw new NotFoundException('User not found');
        }

        const userFilter: UserDto = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            description: user.description,
            location: user.location,
            role: user.role,
            phone: user.phone,
            jobSaved: user.jobSaved,
            skills: user.skills,
            imageProfile: user.imageProfile

        }

        return userFilter;
    }

    async getUserSkills(userId: string) {
        try {
            const user = await this.userModel.findById(userId);
            if (!user) {
                throw new NotFoundException('User not found');
            }

            return user.skills;
        } catch (error) {
            throw error;
        }

    }

    async save(userId: string, jobId: string) {
        const user = await this.userModel.findById(userId);
        const job = await this.jobService.getJobById(jobId);

        if (!user) {
            throw new NotFoundException('User not found');
        }

        const verifyPostSaved = user.jobSaved && user.jobSaved.some(j => j.toString() === job._id.toString());
        if (verifyPostSaved) throw new HttpException('You have already saved this work', HttpStatus.BAD_REQUEST)

        user.jobSaved.push(job._id);
        await user.save();

        return {
            userWhoUpdates: user,
        };
    }

    async role(userId: string, newRole: RoleDto) {
        const user = await this.userModel.findById(userId);

        if (!user) {
            throw new NotFoundException('User not found');
        }

        user.role = newRole.role
        await user.save()
        return user;
    }

    async updateInfo(userId: string, newInfo: ChangeInfoDto) {
        const { fullname, description, email, phone, location } = newInfo
        const user = await this.userModel.findById(userId);

        if (!user) {
            throw new NotFoundException('User not found');
        }

        if (fullname) {
            user.fullname = newInfo.fullname;
        }
        if (description) {
            user.description = newInfo.description;
        }
        if (email) {
            user.email = newInfo.email;
        }
        if (phone) {
            user.phone = newInfo.phone;
        }
        if (location) {
            user.location = newInfo.location;
        }

        await user.save();

        return user;
    }

    async updateImage(userId: string | undefined, newImage: ChangeImageDto) {
        const { imageProfile } = newImage
        const user = await this.userModel.findById(userId);

        if (!user) {
            throw new NotFoundException('User not found');
        }

        user.imageProfile = imageProfile;
        await user.save();
        return user;
    }

    async addSkills(userId: string | undefined, newSkills: AddSkillsDto) {
        try {
            const { skills } = newSkills
            const user = await this.userModel.findById(userId);

            if (!user) {
                throw new NotFoundException('User not found');
            }

            if (skills.length > 11) {
                throw new HttpException('Maximum added skills', 400)
            }

            user.skills = skills
            await user.save()

            return new HttpException("Skill added", 200);
        } catch (error) {
            throw error;
        }

    }

    async emptySkill(userId: string | undefined) {
        try {
            const user = await this.userModel.findById(userId);

            if (!user) {
                throw new NotFoundException('User not found');
            }

            user.skills = []
            await user.save();

            return new HttpException("Skill deleted", 200);
        } catch (error) {
            throw error;
        }
    }


}
