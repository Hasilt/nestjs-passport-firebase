import { AppService } from './app.service';
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
    getHello(): string;
    getPublic(): any;
    getProtected(req: any): any;
    getProtectedCookie(req: any): any;
}
