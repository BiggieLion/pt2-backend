import { NestFactory } from '@nestjs/core';
import { DocumentsModule } from './documents.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { ResponseInterceptor } from '@app/common';
import { Logger } from 'nestjs-pino';

async function bootstrap() {
  const app = await NestFactory.create(DocumentsModule);
  const configSvc = app.get(ConfigService);
  app.enableCors({
    origin: '*',
    credentials: true,
  });
  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useLogger(app.get(Logger));
  await app.listen(configSvc.getOrThrow('documents.httpPort'));
}

bootstrap();
