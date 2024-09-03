import { passportJwtSecret } from 'jwks-rsa';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { DecodedIdToken } from '../decoded-id-token';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { FIREBASE_AUTH_CONFIG, JWT_FROM_REQUEST } from '../constants';
import { FirebaseAuthConfig } from '../firebase-auth.config';

@Injectable()
export class FirebaseStrategy extends PassportStrategy(Strategy, 'firebase-token') {
  constructor(
    @Inject(FIREBASE_AUTH_CONFIG) { issuer, audience }: FirebaseAuthConfig,
    @Inject(JWT_FROM_REQUEST) jwtFromRequest: any
  ) {
    super({
      secretOrKeyProvider: passportJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri:
          'https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com',
      }),
      issuer,
      audience,
      jwtFromRequest,
      algorithms: ['RS256'],
    });
  }

  validate(payload: DecodedIdToken): any | Promise<any> {
    return payload;
  }

}
