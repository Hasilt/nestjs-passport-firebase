import { Module } from '@nestjs/common';
import { FirebaseAuthModule } from '@whitecloak/nestjs-passport-firebase';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
    imports: [
        FirebaseAuthModule.register({
            // Replace with your Firebase project ID
            audience: 'your-firebase-project-id',
            issuer: 'https://securetoken.google.com/your-firebase-project-id',

            // Optional: Path to service account key for session cookies
            // serviceAccountPath: './path/to/serviceAccountKey.json',

            // Optional: Custom cookie name (defaults to '__session')
            cookieName: '__session',
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService],
})
export class AuthModule { }