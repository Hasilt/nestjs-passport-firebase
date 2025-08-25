"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const admin = require("firebase-admin");
let AuthService = class AuthService {
    async createSessionCookie(idToken) {
        try {
            const expiresIn = 60 * 60 * 24 * 5 * 1000;
            const sessionCookie = await admin.auth().createSessionCookie(idToken, {
                expiresIn,
            });
            return sessionCookie;
        }
        catch (error) {
            throw new Error(`Failed to create session cookie: ${error.message}`);
        }
    }
    async verifySessionCookie(sessionCookie) {
        try {
            const decodedClaims = await admin.auth().verifySessionCookie(sessionCookie, true);
            return decodedClaims;
        }
        catch (error) {
            throw new Error(`Invalid session cookie: ${error.message}`);
        }
    }
    async revokeAllSessions(uid) {
        try {
            await admin.auth().revokeRefreshTokens(uid);
        }
        catch (error) {
            throw new Error(`Failed to revoke sessions: ${error.message}`);
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)()
], AuthService);
//# sourceMappingURL=auth.service.js.map