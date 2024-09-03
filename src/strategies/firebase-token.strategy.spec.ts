import { FirebaseStrategy } from './firebase-token.strategy';
import { DecodedIdToken } from '../decoded-id-token';
import { ExtractJwt } from 'passport-jwt';

describe('Firebase Strategy', () => {
  let strategy: FirebaseStrategy;

  beforeEach(() => {
    strategy = new FirebaseStrategy(
      { issuer: 'issuer', audience: 'audience', serviceAccountPath: 'path/to/service-account.json' },
      [ExtractJwt.fromAuthHeaderAsBearerToken()]
    );
  });

  it('should be defined', () => {
    expect(strategy).toBeDefined();
  });

  describe('validate', () => {
    it('should return DecodedIdToken', () => {
      const token = { uid: Math.random().toString() } as DecodedIdToken;
      const data = strategy.validate(token);

      expect(data).not.toBe(null);
      expect(data).toEqual(token);
    });

    it('should handle empty token', () => {
      const token = {} as DecodedIdToken;
      const data = strategy.validate(token);

      expect(data).toEqual({});
    });

    it('should handle token with additional properties', () => {
      const token:any = { uid: 'test-uid', email: 'test@example.com', name: 'Test User' } as Partial<DecodedIdToken>;
      const data = strategy.validate(token);

      expect(data).toEqual(token);
      expect(data.uid).toBe('test-uid');
      expect(data.email).toBe('test@example.com');
      expect(data.name).toBe('Test User');
    });
  });

  describe('constructor', () => {
    it('should create strategy with custom options', () => {
      const customStrategy = new FirebaseStrategy(
        { issuer: 'custom-issuer', audience: 'custom-audience', serviceAccountPath: 'path/to/service-account.json' },
        [ExtractJwt.fromAuthHeaderWithScheme('Bearer')]
      );

      expect(customStrategy).toBeDefined();
      // Add more specific assertions if the constructor options are accessible
    });
  });
});
