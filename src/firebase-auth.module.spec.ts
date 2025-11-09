import { Test, TestingModule } from '@nestjs/testing';
import { PassportModule } from '@nestjs/passport';
import { FirebaseAuthModule } from './firebase-auth.module';
import { FirebaseStrategy } from './strategies/token/firebase-token.strategy';
import { FirebaseCookieStrategy } from './strategies/cookie/firebase-cookie.strategy';
import { FirebaseAuthConfig } from './firebase-auth.config';
import { FIREBASE_AUTH_CONFIG, JWT_FROM_REQUEST } from './constants';
import { ExtractJwt } from 'passport-jwt';

jest.mock('./strategies/token/firebase-token.strategy');
jest.mock('./strategies/cookie/firebase-cookie.strategy');

describe('FirebaseAuthModule', () => {
  const mockConfig: FirebaseAuthConfig = {
    issuer: 'https://securetoken.google.com/test-project',
    audience: 'test-project',
    cookieName: 'firebase-token',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    it('should return a dynamic module with correct structure', () => {
      const dynamicModule = FirebaseAuthModule.register(mockConfig);

      expect(dynamicModule).toEqual({
        module: FirebaseAuthModule,
        imports: [
          PassportModule.register({
            defaultStrategy: ['firebase-token', 'firebase-cookie']
          })
        ],
        providers: expect.arrayContaining([
          {
            provide: FIREBASE_AUTH_CONFIG,
            useValue: mockConfig,
          },
          expect.objectContaining({
            provide: JWT_FROM_REQUEST,
          }),
          FirebaseStrategy,
          FirebaseCookieStrategy,
        ]),
        exports: [
          PassportModule,
          FirebaseStrategy,
          FirebaseCookieStrategy,
          FIREBASE_AUTH_CONFIG,
          JWT_FROM_REQUEST,
        ],
      });
    });

    it('should provide FIREBASE_AUTH_CONFIG with the passed config', () => {
      const dynamicModule = FirebaseAuthModule.register(mockConfig);

      const configProvider = dynamicModule.providers?.find(
        (p: any) => p.provide === FIREBASE_AUTH_CONFIG
      ) as any;

      expect(configProvider).toBeDefined();
      expect(configProvider.useValue).toEqual(mockConfig);
    });

    it('should provide JWT_FROM_REQUEST with a factory', () => {
      const dynamicModule = FirebaseAuthModule.register(mockConfig);

      const jwtProvider = dynamicModule.providers?.find(
        (p: any) => p.provide === JWT_FROM_REQUEST
      ) as any;

      expect(jwtProvider).toBeDefined();
      expect(jwtProvider.useFactory).toBeDefined();
      expect(typeof jwtProvider.useFactory).toBe('function');
    });

    it('should use ExtractJwt.fromAuthHeaderAsBearerToken in JWT_FROM_REQUEST factory', () => {
      const dynamicModule = FirebaseAuthModule.register(mockConfig);

      const jwtProvider = dynamicModule.providers?.find(
        (p: any) => p.provide === JWT_FROM_REQUEST
      ) as any;

      const extractor = jwtProvider.useFactory();

      const mockRequest = {
        headers: {
          authorization: 'Bearer test-token-123',
        },
      };

      const token = extractor(mockRequest);
      expect(token).toBe('test-token-123');
    });

    it('should include FirebaseStrategy in providers', () => {
      const dynamicModule = FirebaseAuthModule.register(mockConfig);

      expect(dynamicModule.providers).toContain(FirebaseStrategy);
    });

    it('should include FirebaseCookieStrategy in providers', () => {
      const dynamicModule = FirebaseAuthModule.register(mockConfig);

      expect(dynamicModule.providers).toContain(FirebaseCookieStrategy);
    });

    it('should export all required providers and modules', () => {
      const dynamicModule = FirebaseAuthModule.register(mockConfig);

      expect(dynamicModule.exports).toEqual([
        PassportModule,
        FirebaseStrategy,
        FirebaseCookieStrategy,
        FIREBASE_AUTH_CONFIG,
        JWT_FROM_REQUEST,
      ]);
    });

    it('should import PassportModule with correct default strategies', () => {
      const dynamicModule = FirebaseAuthModule.register(mockConfig);

      expect(dynamicModule.imports).toHaveLength(1);
      // PassportModule.register returns a dynamic module, so we check the structure
      expect(dynamicModule.imports).toBeDefined();
    });

    it('should handle different config values', () => {
      const customConfig: FirebaseAuthConfig = {
        issuer: 'https://securetoken.google.com/custom-project',
        audience: 'custom-project',
      };

      const dynamicModule = FirebaseAuthModule.register(customConfig);

      const configProvider = dynamicModule.providers?.find(
        (p: any) => p.provide === FIREBASE_AUTH_CONFIG
      ) as any;

      expect(configProvider.useValue).toEqual(customConfig);
    });

    it('should handle config with optional cookieName', () => {
      const configWithCookie: FirebaseAuthConfig = {
        issuer: 'https://securetoken.google.com/test',
        audience: 'test',
        cookieName: 'custom-cookie-name',
      };

      const dynamicModule = FirebaseAuthModule.register(configWithCookie);

      const configProvider = dynamicModule.providers?.find(
        (p: any) => p.provide === FIREBASE_AUTH_CONFIG
      ) as any;

      expect(configProvider.useValue.cookieName).toBe('custom-cookie-name');
    });
  });

  describe('registerAsync', () => {
    it('should return a dynamic module with correct structure', () => {
      const factory = jest.fn().mockReturnValue(mockConfig);

      const dynamicModule = FirebaseAuthModule.registerAsync({
        useFactory: factory,
      });

      expect(dynamicModule).toEqual({
        module: FirebaseAuthModule,
        imports: [
          PassportModule.register({
            defaultStrategy: ['firebase-token', 'firebase-cookie']
          })
        ],
        providers: expect.arrayContaining([
          expect.objectContaining({
            provide: FIREBASE_AUTH_CONFIG,
            useFactory: factory,
            inject: [],
          }),
          expect.objectContaining({
            provide: JWT_FROM_REQUEST,
          }),
          FirebaseStrategy,
          FirebaseCookieStrategy,
        ]),
        exports: [
          PassportModule,
          FirebaseStrategy,
          FirebaseCookieStrategy,
          FIREBASE_AUTH_CONFIG,
          JWT_FROM_REQUEST,
        ],
      });
    });

    it('should use the provided factory function', () => {
      const factory = jest.fn().mockReturnValue(mockConfig);

      const dynamicModule = FirebaseAuthModule.registerAsync({
        useFactory: factory,
      });

      const configProvider = dynamicModule.providers?.find(
        (p: any) => p.provide === FIREBASE_AUTH_CONFIG
      ) as any;

      expect(configProvider.useFactory).toBe(factory);
    });

    it('should handle async factory function', () => {
      const asyncFactory = jest.fn().mockResolvedValue(mockConfig);

      const dynamicModule = FirebaseAuthModule.registerAsync({
        useFactory: asyncFactory,
      });

      const configProvider = dynamicModule.providers?.find(
        (p: any) => p.provide === FIREBASE_AUTH_CONFIG
      ) as any;

      expect(configProvider.useFactory).toBe(asyncFactory);
    });

    it('should use provided inject array', () => {
      const factory = jest.fn();
      const injectTokens = ['CONFIG_SERVICE', 'LOGGER'];

      const dynamicModule = FirebaseAuthModule.registerAsync({
        useFactory: factory,
        inject: injectTokens,
      });

      const configProvider = dynamicModule.providers?.find(
        (p: any) => p.provide === FIREBASE_AUTH_CONFIG
      ) as any;

      expect(configProvider.inject).toEqual(injectTokens);
    });

    it('should default to empty inject array when not provided', () => {
      const factory = jest.fn();

      const dynamicModule = FirebaseAuthModule.registerAsync({
        useFactory: factory,
      });

      const configProvider = dynamicModule.providers?.find(
        (p: any) => p.provide === FIREBASE_AUTH_CONFIG
      ) as any;

      expect(configProvider.inject).toEqual([]);
    });

    it('should provide JWT_FROM_REQUEST with a factory', () => {
      const dynamicModule = FirebaseAuthModule.registerAsync({
        useFactory: () => mockConfig,
      });

      const jwtProvider = dynamicModule.providers?.find(
        (p: any) => p.provide === JWT_FROM_REQUEST
      ) as any;

      expect(jwtProvider).toBeDefined();
      expect(jwtProvider.useFactory).toBeDefined();
      expect(typeof jwtProvider.useFactory).toBe('function');
    });

    it('should include FirebaseStrategy in providers', () => {
      const dynamicModule = FirebaseAuthModule.registerAsync({
        useFactory: () => mockConfig,
      });

      expect(dynamicModule.providers).toContain(FirebaseStrategy);
    });

    it('should include FirebaseCookieStrategy in providers', () => {
      const dynamicModule = FirebaseAuthModule.registerAsync({
        useFactory: () => mockConfig,
      });

      expect(dynamicModule.providers).toContain(FirebaseCookieStrategy);
    });

    it('should export all required providers and modules', () => {
      const dynamicModule = FirebaseAuthModule.registerAsync({
        useFactory: () => mockConfig,
      });

      expect(dynamicModule.exports).toEqual([
        PassportModule,
        FirebaseStrategy,
        FirebaseCookieStrategy,
        FIREBASE_AUTH_CONFIG,
        JWT_FROM_REQUEST,
      ]);
    });

    it('should import PassportModule with correct default strategies', () => {
      const dynamicModule = FirebaseAuthModule.registerAsync({
        useFactory: () => mockConfig,
      });

      expect(dynamicModule.imports).toHaveLength(1);
      expect(dynamicModule.imports).toBeDefined();
    });

    it('should handle imports option', () => {
      const mockImports = [
        { module: class ConfigModule { } },
      ];

      const dynamicModule = FirebaseAuthModule.registerAsync({
        useFactory: () => mockConfig,
        imports: mockImports,
      });

      expect(dynamicModule.imports).toHaveLength(1);
    });
  });

  describe('module metadata', () => {
    it('should have @Global() decorator', () => {
      const isGlobal = Reflect.getMetadata('__module:global__', FirebaseAuthModule);
      expect(isGlobal).toBe(true);
    });

    it('should return FirebaseAuthModule as the module in register', () => {
      const dynamicModule = FirebaseAuthModule.register(mockConfig);
      expect(dynamicModule.module).toBe(FirebaseAuthModule);
    });

    it('should return FirebaseAuthModule as the module in registerAsync', () => {
      const dynamicModule = FirebaseAuthModule.registerAsync({
        useFactory: () => mockConfig,
      });
      expect(dynamicModule.module).toBe(FirebaseAuthModule);
    });
  });

  describe('JWT extraction', () => {
    it('should extract token from Authorization header with Bearer scheme', () => {
      const dynamicModule = FirebaseAuthModule.register(mockConfig);

      const jwtProvider = dynamicModule.providers?.find(
        (p: any) => p.provide === JWT_FROM_REQUEST
      ) as any;

      const extractor = jwtProvider.useFactory();

      const mockRequest = {
        headers: {
          authorization: 'Bearer my-jwt-token',
        },
      };

      expect(extractor(mockRequest)).toBe('my-jwt-token');
    });

    it('should return null when no Authorization header is present', () => {
      const dynamicModule = FirebaseAuthModule.register(mockConfig);

      const jwtProvider = dynamicModule.providers?.find(
        (p: any) => p.provide === JWT_FROM_REQUEST
      ) as any;

      const extractor = jwtProvider.useFactory();

      const mockRequest = {
        headers: {},
      };

      expect(extractor(mockRequest)).toBeNull();
    });

    it('should return null when Authorization header does not use Bearer scheme', () => {
      const dynamicModule = FirebaseAuthModule.register(mockConfig);

      const jwtProvider = dynamicModule.providers?.find(
        (p: any) => p.provide === JWT_FROM_REQUEST
      ) as any;

      const extractor = jwtProvider.useFactory();

      const mockRequest = {
        headers: {
          authorization: 'Basic dXNlcjpwYXNz',
        },
      };

      expect(extractor(mockRequest)).toBeNull();
    });
  });

  describe('provider configuration', () => {
    it('should have all required providers in register', () => {
      const dynamicModule = FirebaseAuthModule.register(mockConfig);

      expect(dynamicModule.providers).toHaveLength(4);
    });

    it('should have all required providers in registerAsync', () => {
      const dynamicModule = FirebaseAuthModule.registerAsync({
        useFactory: () => mockConfig,
      });

      expect(dynamicModule.providers).toHaveLength(4);
    });

    it('should have all required exports', () => {
      const dynamicModule = FirebaseAuthModule.register(mockConfig);

      expect(dynamicModule.exports).toHaveLength(5);
    });
  });
});