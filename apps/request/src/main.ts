import { NestFactory } from '@nestjs/core';
import { RequestsModule } from './requests.module';
import { ValidationPipe } from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import { ResponseInterceptor } from '@app/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(RequestsModule);
  const configSvc = app.get(ConfigService);
  app.enableCors({
    origin: '*',
    credentials: true,
  });
  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useLogger(app.get(Logger));
  await app.listen(configSvc.getOrThrow('request.httpPort'));
}

bootstrap();
