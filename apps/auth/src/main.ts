import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';
import { ValidationPipe } from '@nestjs/common';
import { Logger } from 'nestjs-pino';

import { Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { ResponseInterceptor } from '@app/common';

async function bootstrap() {
  const app = await NestFactory.create(AuthModule);
  const configSvc = app.get(ConfigService);
  app.connectMicroservice({
    transport: Transport.TCP,
    options: {
      host: '0.0.0.0',
      port: configSvc.getOrThrow('auth.tcpPort'),
    },
  });
  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useLogger(app.get(Logger));
  await app.startAllMicroservices();
  await app.listen(configSvc.getOrThrow('auth.httpPort'));
}
bootstrap();
