import { NestFactory } from '@nestjs/core';
import { RequesterModule } from './requester.module';
import { ValidationPipe } from '@nestjs/common';
import { ResponseInterceptor } from '@app/common';
import { Logger } from 'nestjs-pino';
import { ConfigService } from '@nestjs/config';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(RequesterModule);
  const configSvc = app.get(ConfigService);
  app.connectMicroservice({
    transport: Transport.TCP,
    options: {
      host: '0.0.0.0',
      port: configSvc.getOrThrow('requester.tcpPort'),
    },
  });
  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useLogger(app.get(Logger));
  await app.startAllMicroservices();
  await app.listen(configSvc.getOrThrow('requester.httpPort'));
}

bootstrap();
