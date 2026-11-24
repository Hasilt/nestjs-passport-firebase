import { Strategy } from 'passport-custom';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import { App, cert, getApp, getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { FIREBASE_AUTH_CONFIG } from '../../constants';
import { FirebaseAuthConfig } from '../../firebase-auth.config';

@Injectable()
export class FirebaseCookieStrategy extends PassportStrategy(Strategy, 'firebase-cookie') {
    private firebaseAdmin!: App;

    constructor(
        @Inject(FIREBASE_AUTH_CONFIG) private config: FirebaseAuthConfig
    ) {
        super();
        this.initializeFirebaseAdmin();
    }

    private initializeFirebaseAdmin() {
        if (!getApps().length) {
            if (!this.config.serviceAccountPath) {
                throw new Error('FirebaseAuthConfig.serviceAccountPath is required for cookie auth');
            }
            this.firebaseAdmin = initializeApp({
                credential: cert(this.config.serviceAccountPath),
            });
        } else {
            this.firebaseAdmin = getApp();
        }
    }

    async validate(req: any): Promise<any> {
        const sessionCookie = req.cookies[this.config.cookieName ?? '__session'] || '';

        if (!sessionCookie) {
            throw new UnauthorizedException('No session cookie found');
        }

        try {
            const decodedClaims = await getAuth(this.firebaseAdmin).verifySessionCookie(
                sessionCookie,
                true
            );
            return decodedClaims;
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Invalid session cookie';
            throw new UnauthorizedException(message || 'Invalid session cookie');
        }
    }
}
