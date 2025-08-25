"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const cookieParser = require("cookie-parser");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.use(cookieParser());
    app.enableCors({
        origin: ['http://localhost:3000', 'http://localhost:4200'],
        credentials: true,
    });
    await app.listen(3000);
    console.log('Example app running on http://localhost:3000');
    console.log('Test endpoints:');
    console.log('  GET /public - No auth required');
    console.log('  GET /protected - Requires Bearer token');
    console.log('  GET /protected-cookie - Requires session cookie');
    console.log('  GET /auth/me - User profile (Bearer token)');
}
bootstrap();
//# sourceMappingURL=main.js.map