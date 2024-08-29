import { NestFactory } from '@nestjs/core';
import { RequestsModule } from './requests.module';

async function bootstrap() {
  const app = await NestFactory.create(RequestsModule);
  app.setGlobalPrefix('api/v1');
  await app.listen(3000);
}
bootstrap();
