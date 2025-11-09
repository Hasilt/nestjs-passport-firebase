import { FirebaseStrategy } from './firebase-token.strategy';
import { DecodedIdToken } from '../../decoded-id-token';
import { ExtractJwt } from 'passport-jwt';

// Mocking firebase-admin module
jest.mock('firebase-admin', () => ({
  auth: jest.fn().mockReturnValue({
    verifyIdToken: jest.fn(),
  }),
  initializeApp: jest.fn(),
  credential: {
    cert: jest.fn(),
  },
}));

describe('Firebase Strategy', () => {
  let strategy: FirebaseStrategy;

  beforeEach(() => {
    strategy = new FirebaseStrategy(
      {
        issuer: 'issuer',
        audience: 'audience',
        serviceAccountPath: 'path/to/service-account.json'
      },
      [ExtractJwt.fromAuthHeaderAsBearerToken()]
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  describe('validate', () => {
    it('should return DecodedIdToken', () => {
      const token = { uid: Math.random().toString() } as DecodedIdToken;
      const data = strategy.validate(token);

      expect(data).not.toBeNull();
      expect(data).toEqual(token);
    });

    it('should handle empty token', () => {
      const token = {} as DecodedIdToken;
      const data = strategy.validate(token);

      expect(data).toEqual({});
    });

    it('should handle token with additional properties', () => {
      const token = {
        uid: 'test-uid',
        email: 'test@example.com',
        name: 'Test User'
      } as any;
      const data = strategy.validate(token);

      expect(data).toEqual(token);
      expect(data.uid).toBe('test-uid');
      expect(data.email).toBe('test@example.com');
      expect(data.name).toBe('Test User');
    });

    it('should preserve all token properties', () => {
      const token = {
        uid: 'user-123',
        email: 'user@example.com',
        email_verified: true,
        auth_time: 1234567890,
        iat: 1234567890,
        exp: 1234571490,
      } as any;

      const result = strategy.validate(token);

      expect(result).toEqual(token);
      expect(Object.keys(result)).toHaveLength(Object.keys(token).length);
    });
  });

  describe('constructor', () => {
    it('should create strategy with custom options', () => {
      const customStrategy = new FirebaseStrategy(
        {
          issuer: 'custom-issuer',
          audience: 'custom-audience',
          serviceAccountPath: 'custom/path.json'
        },
        [ExtractJwt.fromAuthHeaderWithScheme('Bearer')]
      );

      expect(customStrategy).toBeDefined();
      expect(customStrategy).toBeInstanceOf(FirebaseStrategy);
    });

    it('should create strategy with multiple extractors', () => {
      const multiExtractorStrategy = new FirebaseStrategy(
        {
          issuer: 'issuer',
          audience: 'audience',
          serviceAccountPath: 'path/to/service-account.json'
        },
        [
          ExtractJwt.fromAuthHeaderAsBearerToken(),
          ExtractJwt.fromUrlQueryParameter('token')
        ]
      );

      expect(multiExtractorStrategy).toBeDefined();
    });
  });
});