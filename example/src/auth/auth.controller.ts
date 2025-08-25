import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { FirebaseAuthGuard } from '@whitecloak/nestjs-passport-firebase';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Get('me')
    @UseGuards(FirebaseAuthGuard)
    getProfile(@Request() req): any {
        return {
            uid: req.user.uid,
            email: req.user.email,
            emailVerified: req.user.email_verified,
            name: req.user.name,
            picture: req.user.picture,
            authTime: new Date(req.user.auth_time * 1000),
            iat: new Date(req.user.iat * 1000),
            exp: new Date(req.user.exp * 1000),
        };
    }

    @Post('create-session')
    @UseGuards(FirebaseAuthGuard)
    async createSessionCookie(@Request() req, @Body() body: { idToken: string }): Promise<any> {
        try {
            const sessionCookie = await this.authService.createSessionCookie(body.idToken);
            return {
                message: 'Session cookie created successfully',
                sessionCookie,
                user: req.user,
            };
        } catch (error) {
            return {
                message: 'Failed to create session cookie',
                error: error.message,
            };
        }
    }

    @Get('test-cookie')
    @UseGuards(new FirebaseAuthGuard('firebase-cookie'))
    testCookieAuth(@Request() req): any {
        return {
            message: 'Cookie authentication successful',
            user: req.user,
            timestamp: new Date().toISOString(),
        };
    }
}