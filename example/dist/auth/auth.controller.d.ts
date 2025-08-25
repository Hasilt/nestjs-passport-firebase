import { AuthService } from './auth.service';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    getProfile(req: any): any;
    createSessionCookie(req: any, body: {
        idToken: string;
    }): Promise<any>;
    testCookieAuth(req: any): any;
}
