import { Strategy } from 'passport-custom';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import { FIREBASE_AUTH_CONFIG } from '../constants';
import { FirebaseAuthConfig } from '../firebase-auth.config';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseCookieStrategy extends PassportStrategy(Strategy, 'firebase-cookie') {
    private firebaseAdmin: admin.app.App;

    constructor(
        @Inject(FIREBASE_AUTH_CONFIG) private config: FirebaseAuthConfig
    ) {
        super();
        this.initializeFirebaseAdmin();
    }

    private initializeFirebaseAdmin() {
      
        if (!admin.apps.length) {
            this.firebaseAdmin = admin.initializeApp({
                credential: admin.credential.cert(this.config.serviceAccountPath),
            });
        } else {
            this.firebaseAdmin = admin.app();
        }
    }

    async validate(req: any): Promise<any> {
        const sessionCookie = req.cookies[this.config.cookieName ?? '__session'] || '';

        if (!sessionCookie) {
            throw new UnauthorizedException('No session cookie found');
        }

        try {
            const decodedClaims = await admin.auth().verifySessionCookie(
                sessionCookie,
                true
            );
            return decodedClaims;
        } catch (error) {
            throw new UnauthorizedException(error.message || 'Invalid session cookie');
        }
    }
}