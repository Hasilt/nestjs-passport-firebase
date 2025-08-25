import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class AuthService {
    async createSessionCookie(idToken: string): Promise<string> {
        try {
            // Set session expiration to 5 days
            const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 days in milliseconds

            // Create the session cookie
            const sessionCookie = await admin.auth().createSessionCookie(idToken, {
                expiresIn,
            });

            return sessionCookie;
        } catch (error) {
            throw new Error(`Failed to create session cookie: ${error.message}`);
        }
    }

    async verifySessionCookie(sessionCookie: string): Promise<admin.auth.DecodedIdToken> {
        try {
            const decodedClaims = await admin.auth().verifySessionCookie(
                sessionCookie,
                true, // checkRevoked
            );
            return decodedClaims;
        } catch (error) {
            throw new Error(`Invalid session cookie: ${error.message}`);
        }
    }

    async revokeAllSessions(uid: string): Promise<void> {
        try {
            await admin.auth().revokeRefreshTokens(uid);
        } catch (error) {
            throw new Error(`Failed to revoke sessions: ${error.message}`);
        }
    }
}