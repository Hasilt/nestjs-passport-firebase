import { DynamicModule, Global, Module, Provider } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { FirebaseStrategy } from './strategies/firebase-token.strategy';
import { FirebaseAuthConfig } from './firebase-auth.config';
import { FIREBASE_AUTH_CONFIG, JWT_FROM_REQUEST } from './constants';
import { ExtractJwt } from 'passport-jwt';
import { FirebaseCookieStrategy } from './strategies/firebase-cookie.strategy';

@Global()
@Module({})
export class FirebaseAuthModule {
  static register(firebaseAuthConfig: FirebaseAuthConfig): DynamicModule {
    return {
      module: FirebaseAuthModule,
      imports: [PassportModule.register({ defaultStrategy: ['firebase-token', 'firebase-cookie'] })],
      providers: [
        {
          provide: FIREBASE_AUTH_CONFIG,
          useValue: firebaseAuthConfig,
        },
        {
          provide: JWT_FROM_REQUEST,
          useFactory: () => {
            // Customize this to dynamically determine the jwtFromRequest value
            return ExtractJwt.fromAuthHeaderAsBearerToken();
          },
        },
        FirebaseStrategy,
        FirebaseCookieStrategy
      ],
      exports: [PassportModule, FirebaseStrategy, FirebaseCookieStrategy, FIREBASE_AUTH_CONFIG, JWT_FROM_REQUEST],
    };
  }

  static registerAsync(options: {
    useFactory: (...args: any[]) => Promise<FirebaseAuthConfig> | FirebaseAuthConfig;
    inject?: any[];
    imports?: DynamicModule['imports']; 
  }): DynamicModule {
    return {
      module: FirebaseAuthModule,
      imports: [PassportModule.register({ defaultStrategy: ['firebase-token', 'firebase-cookie'] })],
      providers: [
        {
          provide: FIREBASE_AUTH_CONFIG,
          useFactory: options.useFactory,
          inject: options.inject || [],
        },
        {
          provide: JWT_FROM_REQUEST,
          useFactory: () => ExtractJwt.fromAuthHeaderAsBearerToken(),
        },
        FirebaseStrategy,
        FirebaseCookieStrategy
      ],
      exports: [PassportModule, FirebaseStrategy, FirebaseCookieStrategy, FIREBASE_AUTH_CONFIG, JWT_FROM_REQUEST],
    };
  }
}
