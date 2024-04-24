/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RegisterAuthDto } from 'src/dto/register.dto';
import { User } from 'src/schemas/user.schema';
import { hash, compare } from 'bcrypt'
import { LoginAuthDto } from 'src/dto/login.dto';
import { JwtService } from '@nestjs/jwt';



@Injectable()
export class AuthService {
    constructor(@InjectModel(User.name) private userModel: Model<User>,
        private jwtService: JwtService) { }


    async register(user: RegisterAuthDto) {
        try {
            const { fullname, email, password } = user;
            const hashPassword = await hash(password, 10)
            const findUserRegistered = await this.userModel.findOne({ email })
            if (findUserRegistered) throw new HttpException('The email entered already exists', HttpStatus.BAD_REQUEST)

            const newUser = {
                fullname,
                email,
                password: hashPassword
            }

            const registerUser = await this.userModel.create(newUser)
            await registerUser.save()
            return registerUser;
        } catch (error) {
            throw new HttpException(`${error}`, 500)
        }
    }

    async login(user: LoginAuthDto) {
        try {
            const { email, password } = user;
            const findUser = await this.userModel.findOne({ email })
            const checkPassword = await compare(password, findUser.password)

            if (!findUser) throw new HttpException('User not found', HttpStatus.NOT_FOUND)
            if (!checkPassword) throw new HttpException('Password incorrect', HttpStatus.BAD_REQUEST)

            const payload = {
                userId: findUser._id,
                fullname: findUser.fullname,
                role: findUser.role,
                email: findUser.email,
                userImage: findUser.userImage
            }
            const accesToken = this.jwtService.sign(payload)

            return accesToken;
        } catch (error) {
            throw new HttpException(`${error}`, 500)
        }

    }

    

}
