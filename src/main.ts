import { NestFactory } from '@nestjs/core';
import { env } from 'process';
import { AppModule } from './app.module';
import { config as dotEnvConfig } from 'dotenv';

dotEnvConfig();

var session = require('express-session');
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors()
  app.setGlobalPrefix('api/v1');
  app.use(session({ secret: 'SECRET' }));

  await app.listen(env.PORT || 3017);
}
bootstrap();
