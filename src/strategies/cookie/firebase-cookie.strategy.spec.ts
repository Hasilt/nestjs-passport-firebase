import { UnauthorizedException } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { FirebaseCookieStrategy } from './firebase-cookie.strategy';
import { FirebaseAuthConfig } from 'src/firebase-auth.config';

jest.mock('firebase-admin', () => {
    const verifySessionCookieMock = jest.fn();
    const authMock = jest.fn(() => ({
        verifySessionCookie: verifySessionCookieMock,
    }));

    return {
        __esModule: true,
        apps: [],
        initializeApp: jest.fn(() => ({ name: 'mockApp' })),
        app: jest.fn(() => ({ name: 'mockApp' })),
        auth: authMock,
        credential: {
            cert: jest.fn(),
        },
    };
});

describe('FirebaseCookieStrategy', () => {
    let strategy: FirebaseCookieStrategy;
    let config: FirebaseAuthConfig;
    let verifySessionCookieMock: jest.Mock;

    beforeEach(() => {
        config = {
            issuer: 'test-issuer',
            audience: 'test-audience',
            cookieName: '__session',
            serviceAccountPath: '/path/to/serviceAccount.json',
        };

        // Reset admin mocks
        (admin.apps as any).length = 0;
        jest.clearAllMocks();

        strategy = new FirebaseCookieStrategy(config as any);

        // Capture mock reference for easy use
        verifySessionCookieMock = (admin.auth() as any).verifySessionCookie;
    });

    it('should initialize Firebase Admin if not already initialized', () => {
        expect(admin.initializeApp).toHaveBeenCalledWith({
            credential: admin.credential.cert(config.serviceAccountPath),
        });
    });

    it('should use existing Firebase app if already initialized', () => {
        (admin.apps as any).length = 1;
        new FirebaseCookieStrategy(config as any);
        expect(admin.app).toHaveBeenCalled();
    });

    it('should throw UnauthorizedException if no cookie found', async () => {
        const req = { cookies: {} };
        await expect(strategy.validate(req)).rejects.toThrow(
            new UnauthorizedException('No session cookie found'),
        );
    });

    it('should return decoded claims if verification succeeds', async () => {
        const decodedClaims = { uid: '12345', email: 'test@example.com' };
        verifySessionCookieMock.mockResolvedValue(decodedClaims);

        const req = { cookies: { __session: 'valid_cookie' } };

        const result = await strategy.validate(req);
        expect(verifySessionCookieMock).toHaveBeenCalledWith('valid_cookie', true);
        expect(result).toEqual(decodedClaims);
    });

    it('should throw UnauthorizedException if verification fails', async () => {
        verifySessionCookieMock.mockRejectedValue(new Error('Invalid cookie'));

        const req = { cookies: { __session: 'bad_cookie' } };

        await expect(strategy.validate(req)).rejects.toThrow(
            new UnauthorizedException('Invalid cookie'),
        );
    });
});
