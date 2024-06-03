import { DynamicModule, Global, Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { FirebaseStrategy } from './firebase.strategy';
import { FirebaseAuthConfig } from './firebase-auth.config';
import { FIREBASE_AUTH_CONFIG, JWT_FROM_REQUEST } from './constants';
import { ExtractJwt } from 'passport-jwt';

@Global()
@Module({})
export class FirebaseAuthModule {
  static register(firebaseAuthConfig: FirebaseAuthConfig): DynamicModule {
    return {
      module: FirebaseAuthModule,
      imports: [PassportModule.register({ defaultStrategy: 'firebase' })],
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
      ],
      exports: [PassportModule, FirebaseStrategy, FIREBASE_AUTH_CONFIG, JWT_FROM_REQUEST],
    };
  }
}
