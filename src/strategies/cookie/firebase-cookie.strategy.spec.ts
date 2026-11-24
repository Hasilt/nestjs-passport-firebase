import { UnauthorizedException } from '@nestjs/common';
import { cert, getApp, getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { FirebaseCookieStrategy } from './firebase-cookie.strategy';
import { FirebaseAuthConfig } from '../../firebase-auth.config';

jest.mock('firebase-admin/app', () => ({
    initializeApp: jest.fn(() => ({ name: 'mockApp' })),
    getApp: jest.fn(() => ({ name: 'mockApp' })),
    getApps: jest.fn(() => []),
    cert: jest.fn((path: string) => ({ path })),
}));

jest.mock('firebase-admin/auth', () => ({
    getAuth: jest.fn(),
}));

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

        verifySessionCookieMock = jest.fn();
        (getApps as jest.Mock).mockReturnValue([]);
        (getAuth as jest.Mock).mockReturnValue({
            verifySessionCookie: verifySessionCookieMock,
        });
        jest.clearAllMocks();
        (getApps as jest.Mock).mockReturnValue([]);
        (getAuth as jest.Mock).mockReturnValue({
            verifySessionCookie: verifySessionCookieMock,
        });

        strategy = new FirebaseCookieStrategy(config as any);
    });

    it('should initialize Firebase Admin if not already initialized', () => {
        expect(cert).toHaveBeenCalledWith(config.serviceAccountPath);
        expect(initializeApp).toHaveBeenCalledWith({
            credential: expect.anything(),
        });
    });

    it('should use existing Firebase app if already initialized', () => {
        (getApps as jest.Mock).mockReturnValue([{}]);
        new FirebaseCookieStrategy(config as any);
        expect(getApp).toHaveBeenCalled();
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
