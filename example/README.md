# Example NestJS Firebase Auth Project

# Firebase Auth Example

This is an example project demonstrating how to use the `@whitecloak/nestjs-passport-firebase` package for Firebase authentication.

## Features

- Firebase JWT token authentication
- Firebase session cookie authentication
- Protected and public endpoints
- User profile endpoints

## Setup

1. Install dependencies:

```bash
npm install
```

2. Configure Firebase in `src/auth/auth.module.ts`:
   - Replace `your-firebase-project-id` with your actual Firebase project ID
   - Optionally add path to service account key for session cookies

3. Start the application:

```bash
npm run start:dev
```

The app will run on `http://localhost:3000`.

## Testing the Application

### Public Endpoint

```bash
curl http://localhost:3000/public
```

### Protected Endpoints (Bearer Token)

```bash
# Get user profile
curl -H "Authorization: Bearer YOUR_FIREBASE_ID_TOKEN"
     http://localhost:3000/auth/me

# Access protected endpoint
curl -H "Authorization: Bearer YOUR_FIREBASE_ID_TOKEN"
     http://localhost:3000/protected
```

### Session Cookie Authentication

```bash
# Create session cookie
curl -X POST
     -H "Authorization: Bearer YOUR_FIREBASE_ID_TOKEN"
     -H "Content-Type: application/json"
     -d '{"idToken":"YOUR_FIREBASE_ID_TOKEN"}'
     http://localhost:3000/auth/create-session

# Use session cookie (replace SESSION_COOKIE with actual cookie)
curl -H "Cookie: __session=SESSION_COOKIE"
     http://localhost:3000/protected-cookie
```

## Endpoints

- `GET /` - Landing page with documentation
- `GET /public` - Public endpoint (no auth required)
- `GET /protected` - Protected endpoint (Bearer token required)
- `GET /protected-cookie` - Protected endpoint (session cookie required)
- `GET /auth/me` - Get user profile (Bearer token required)
- `POST /auth/create-session` - Create session cookie (Bearer token required)
- `GET /auth/test-cookie` - Test cookie authentication

## Firebase Setup

1. Create a Firebase project
2. Enable Authentication
3. Get your project configuration
4. For session cookies, download service account key
5. Update the configuration in `auth.module.ts`

## Development

This example uses the local version of `@whitecloak/nestjs-passport-firebase` via `file:..` dependency.

To test changes to the library:

1. Make changes to the library code
2. Run `npm run build` in the root directory
3. The example app will automatically use the updated code

## Project Structure

- **src/**: Contains the source code for the application.
  - **app.module.ts**: The root module of the application.
  - **app.controller.ts**: Handles incoming requests and responses.
  - **app.service.ts**: Provides business logic and data handling.
  - **auth/**: Contains authentication-related components.
    - **auth.module.ts**: Defines the AuthModule.
    - **auth.controller.ts**: Handles authentication requests.
    - **auth.service.ts**: Contains user authentication logic.
  - **main.ts**: The entry point of the application.

- **test/**: Contains end-to-end tests for the application.
  - **app.e2e-spec.ts**: End-to-end tests ensuring application behavior.
  - **jest-e2e.json**: Configuration for running end-to-end tests with Jest.

## Getting Started

1. **Clone the repository**:

   ```
   git clone <repository-url>
   cd example
   ```

2. **Install dependencies**:

   ```
   npm install
   ```

3. **Run the application**:

   ```
   npm run start
   ```

4. **Run tests**:
   ```
   npm run test:e2e
   ```

## License

This project is licensed under the MIT License.
