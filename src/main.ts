import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
var session = require('express-session');
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors()
  app.use(session({ secret: 'SECRET' }));

  await app.listen(process.env.PORT || 3017);
}
bootstrap();
