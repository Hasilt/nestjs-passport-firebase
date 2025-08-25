import * as admin from 'firebase-admin';
export declare class AuthService {
    createSessionCookie(idToken: string): Promise<string>;
    verifySessionCookie(sessionCookie: string): Promise<admin.auth.DecodedIdToken>;
    revokeAllSessions(uid: string): Promise<void>;
}
