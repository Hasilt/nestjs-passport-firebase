import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
    getHello(): string {
        return `
<!DOCTYPE html>
<html>
<head>
    <title>Firebase Auth Example</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        .endpoint { margin: 20px 0; padding: 15px; border: 1px solid #ddd; }
        .method { color: #007acc; font-weight: bold; }
        .url { color: #d73a49; }
        .desc { color: #666; }
    </style>
</head>
<body>
    <h1>NestJS Firebase Auth Example</h1>
    <p>This example demonstrates the @whitecloak/nestjs-passport-firebase module.</p>
    
    <div class="endpoint">
        <div><span class="method">GET</span> <span class="url">/public</span></div>
        <div class="desc">Public endpoint - no authentication required</div>
    </div>
    
    <div class="endpoint">
        <div><span class="method">GET</span> <span class="url">/protected</span></div>
        <div class="desc">Protected endpoint - requires Bearer token in Authorization header</div>
    </div>
    
    <div class="endpoint">
        <div><span class="method">GET</span> <span class="url">/protected-cookie</span></div>
        <div class="desc">Protected endpoint - requires session cookie</div>
    </div>
    
    <div class="endpoint">
        <div><span class="method">GET</span> <span class="url">/auth/me</span></div>
        <div class="desc">Get user profile - requires Bearer token</div>
    </div>
    
    <h2>Testing Instructions:</h2>
    <ol>
        <li>Get a Firebase ID token from your Firebase project</li>
        <li>For Bearer token: Add <code>Authorization: Bearer YOUR_TOKEN</code> header</li>
        <li>For session cookie: Set <code>__session</code> cookie with session cookie value</li>
    </ol>
    
    <h2>Example with curl:</h2>
    <pre>
# Test public endpoint
curl http://localhost:3000/public

# Test protected endpoint (replace YOUR_TOKEN)
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:3000/protected

# Test user profile
curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:3000/auth/me
    </pre>
</body>
</html>
    `;
    }
}