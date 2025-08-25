"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const nestjs_passport_firebase_1 = require("@whitecloak/nestjs-passport-firebase");
const auth_service_1 = require("./auth.service");
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    getProfile(req) {
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
    async createSessionCookie(req, body) {
        try {
            const sessionCookie = await this.authService.createSessionCookie(body.idToken);
            return {
                message: 'Session cookie created successfully',
                sessionCookie,
                user: req.user,
            };
        }
        catch (error) {
            return {
                message: 'Failed to create session cookie',
                error: error.message,
            };
        }
    }
    testCookieAuth(req) {
        return {
            message: 'Cookie authentication successful',
            user: req.user,
            timestamp: new Date().toISOString(),
        };
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, common_1.Get)('me'),
    (0, common_1.UseGuards)(nestjs_passport_firebase_1.FirebaseAuthGuard),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Object)
], AuthController.prototype, "getProfile", null);
__decorate([
    (0, common_1.Post)('create-session'),
    (0, common_1.UseGuards)(nestjs_passport_firebase_1.FirebaseAuthGuard),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "createSessionCookie", null);
__decorate([
    (0, common_1.Get)('test-cookie'),
    (0, common_1.UseGuards)(new nestjs_passport_firebase_1.FirebaseAuthGuard('firebase-cookie')),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Object)
], AuthController.prototype, "testCookieAuth", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map