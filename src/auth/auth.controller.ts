/* eslint-disable prettier/prettier */
import { RegisterAuthDto } from 'src/dto/register.dto';
import { AuthService } from './auth.service';
import { Controller, Post, Body, HttpStatus, Res } from '@nestjs/common';
import { LoginAuthDto } from 'src/dto/login.dto';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('register')
    async registerUser(@Body() userBody: RegisterAuthDto, @Res() res: Response) {
        try {
            await this.authService.register(userBody);
            return res.status(HttpStatus.OK).json({
                error: 'User registered successfully',
                message: [],
                statusCode: 200
            });
        } catch (error) {
            return res.json({
                error: error.message,
                message: [],
                statusCode: error.status
            });
        }
    }

    @Post('login')
    async loginUser(@Body() userBody: LoginAuthDto, @Res() res: Response) {
        try {
            const loginUser = await this.authService.login(userBody)
            return res.status(HttpStatus.OK).json({
                statusCode: 200,
                accessToken: loginUser
            });
            return loginUser;
        } catch (error) {
            return res.json({
                error: error.message,
                message: [],
                statusCode: error.status
            });
        }

    }

    // RECOVER PASSWORD


    
}
