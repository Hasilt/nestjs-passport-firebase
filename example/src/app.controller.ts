import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AppService } from './app.service';
import { FirebaseAuthGuard } from '@whitecloak/nestjs-passport-firebase';

@Controller()
export class AppController {
    constructor(private readonly appService: AppService) { }

    @Get()
    getHello(): string {
        return this.appService.getHello();
    }

    @Get('public')
    getPublic(): any {
        return {
            message: 'This is a public endpoint',
            timestamp: new Date().toISOString(),
        };
    }

    @UseGuards(FirebaseAuthGuard)
    @Get('protected')
    getProtected(@Request() req: any): any {
        return {
            message: 'This is a protected endpoint',
            user: req.user,
            timestamp: new Date().toISOString(),
        };
    }

    @UseGuards(AuthGuard('firebase-cookie'))
    @Get('protected-cookie')
    getProtectedCookie(@Request() req: any): any {
        return {
            message: 'This is a protected endpoint using session cookie',
            user: req.user,
            timestamp: new Date().toISOString(),
        };
    }
}