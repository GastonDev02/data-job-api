/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AddSkillsDto, ChangeImageDto, ChangeInfoDto, RoleDto, UserDto } from 'src/dto/user.dto';
import { JobsService } from 'src/jobs/jobs.service';
import { User } from 'src/schemas/user.schema';
import { JwtService } from '@nestjs/jwt';
import { hash, compare } from 'bcrypt'

//NODEMAILER
import { NewPasswordDto } from 'src/dto/new-password.dto';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class UserService {
    constructor(@InjectModel(User.name) private userModel: Model<User>,
        private jobService: JobsService, private jwtService: JwtService,
        private readonly mailerService: MailerService) { }

    //GET USERS
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
            userImage: user.userImage

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

    //GET REQUEST JOBS USERS (FOR COMPANIES)

    async getRequestJobs(userId: string) {
        try {
            const userCompany = await this.userModel.findById(userId);

            if (!userCompany) {
                throw new NotFoundException('User not found');
            }
            const applicants = userCompany.applicants;

            const populatedApplicants: any[] = [];

            for (const applicant of applicants) {
                const { applicant: applicantId, jobTo } = applicant;

                const populatedApplicant = await this.userModel
                    .findById(applicantId)
                    .select('-password');
                if (populatedApplicant) {
                    populatedApplicants.push({
                        user: populatedApplicant,
                        jobTo: jobTo,
                    });
                }
            }
            return populatedApplicants;
        } catch (error) {
            throw error;
        }
    }


    async deleteRequest(userId: string, applicantId: string) {
        try {
            const user = await this.userModel.findById(userId);

            if (!user) {
                throw new NotFoundException('User not found');
            }

            // Encontrar el índice del solicitante en el array
            const index = user.applicants.findIndex(applicant => applicant.applicant.toString() === applicantId);

            if (index !== -1) {
                // Eliminar el solicitante específico del array
                user.applicants.splice(index, 1);

                // Guardar los cambios en el documento de usuario
                const updatedUser = await user.save();

                return updatedUser;
            } else {
                throw new NotFoundException('Applicant not found');
            }
        } catch (error) {
            throw error;
        }
    }



    //USER SAVE A JOB
    async getSavedJobs(userId: string) {
        try {
            const userJobs = await this.userModel.findById(userId);

            if (Array.isArray(userJobs.jobSaved) && userJobs.jobSaved.length > 0) {
                const populatedSavedJobs = await Promise.all(
                    userJobs.jobSaved.map(async (jobId) => {
                        const jobIdString = jobId.toString();
                        const job = await this.jobService.getJobById(jobIdString);
                        return job;
                    })
                );

                return populatedSavedJobs;
            } else {
                return [];
            }
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

        user.jobSaved.push(job._id.toString());
        await user.save();

        return {
            userWhoUpdates: user,
        };
    }

    // USER ROLE

    async role(userId: string, newRole: RoleDto) {
        const user = await this.userModel.findById(userId);

        if (!user) {
            throw new NotFoundException('User not found');
        }

        user.role = newRole.role
        await user.save()
        return user;
    }

    //USER INFO

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

    //USER IMAGE

    async updateImage(userId: string | undefined, newImage: ChangeImageDto) {
        const { userImage } = newImage
        const user = await this.userModel.findById(userId);

        if (!user) {
            throw new NotFoundException('User not found');
        }

        user.userImage = userImage;
        await user.save();
        return user;
    }

    // USER SKILLS

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

    //JOB REQUEST

    async requestAJob(userId: string, jobId: string) {
        try {
            const userApplicant = await this.userModel.findById(userId);
            const jobToApplies = await this.jobService.getJobById(jobId);
            const company = await this.userModel.findById(jobToApplies.author);

            if (!company) {
                throw new NotFoundException('Company not found');
            }

            // Verificar si el usuario ya ha aplicado a esta oferta
            const hasAlreadyApplied = company.applicants.some(
                (app) => app.applicant.toString() === userId && app.jobTo === jobToApplies.jobTitle
            );

            if (hasAlreadyApplied) {
                throw new HttpException('You have already applied for this offer', 400);
            }

            if (userApplicant.role === 'company' || userApplicant.role === 'admin') {
                throw new HttpException(
                    'Companies and administrators cannot apply for offers',
                    401
                );
            }

            if (company._id.toString() === userApplicant._id.toString()) {
                throw new HttpException(
                    'You cannot apply for an offer that is yours',
                    400
                );
            }


            if (!company.applicants) {
                company.applicants = [];
            }


            company.applicants.push({ applicant: userApplicant._id, jobTo: jobToApplies.jobTitle, displayed: false });


            await company.save();

            return {
                company,
            };
        } catch (error) {
            throw error;
        }
    }

    async markAsView(userId: string, applicantId: string) {
        const userCompany = await this.userModel.findById(userId);
    
        for (const ap of userCompany.applicants) {
            if (ap.applicant.toString() === applicantId && !ap.displayed) {
                ap.displayed = true;
                const applicantUser = await this.userModel.findById(ap.applicant);
                const jobToApplies = await this.jobService.getJobByTitle(ap.jobTo);
    
                if (applicantUser && applicantUser.email && jobToApplies && jobToApplies.jobTitle) {
                    this.mailerService.sendMail({
                        from: 'DataJob',
                        to: applicantUser.email,
                        subject: "They have seen your profile!",
                        html: `<h1>Hello <span style="color: #ff7f50; font-weight: bold;">${applicantUser.fullname}</span>!</h1>
                               <br></br/>
                               <p>We know you applied for the <span style="color: #ff7f50; font-weight: bold;">${jobToApplies.jobTitle}</span> offer. Congratulations! A recruiter saw your application. 
                               If they move forward, they will be communicating directly with you!</p>`,
                    });
                }
    
                break;
            }
        }
    
        await userCompany.save();
        return userCompany.applicants;
    }

    // RECOVER PASSWORD

    async sendMailRecover(userMail: string) {
        try {
            const payload = {
                userMail
            }
            const newJwt = this.jwtService.sign(payload)
            this.mailerService.sendMail({
                from: 'DataJob',
                to: userMail,
                subject: "Recover your passwords",
                html: `<h1>Hello! You have requested to change your password. Please, to continue click on the button below</h1>
                                <hr>
                                <a href="http://localhost:5173/restore-pass/${newJwt}">CLICK HERE</a>
                         `,
            })

        } catch (error) {
            throw error
        }

    }

    async recoverPassword(token: string, userNewPass: NewPasswordDto) {
        try {
            const { newPassword } = userNewPass;
            this.jwtService.verify(token)
            const data = this.jwtService.decode(token);
            const email = data.userMail;

            const user = await this.userModel.findOne({ email: email });

            if (!user) {
                throw new NotFoundException('User not found');
            }

            const checkPassword = await compare(newPassword, user.password);

            if (checkPassword) {
                throw new HttpException('You must choose a different password', HttpStatus.BAD_REQUEST);
            }

            const hashedNewPassword = await hash(newPassword, 10);
            user.password = hashedNewPassword;
            await user.save();
        } catch (error) {
            if (error.message === "jwt malformed") throw new HttpException('Invalid token. Please return a send the recover email', HttpStatus.BAD_REQUEST)
            if (error.message === "jwt expired") throw new HttpException('Token expired', HttpStatus.UNAUTHORIZED)
            throw error;
        }
    }

}
