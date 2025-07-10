import { NestFactory } from '@nestjs/core';
import { NotificationsModule } from './notifications.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { ResponseInterceptor } from '@app/common';
import { Logger } from 'nestjs-pino';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(NotificationsModule);
  const configSvc = app.get(ConfigService);
  app.enableCors({
    origin: '*',
    credentials: true,
  });
  app.connectMicroservice({
    transport: Transport.TCP,
    options: {
      host: '0.0.0.0',
      port: configSvc.getOrThrow('notifications.tcpPort'),
    },
  });
  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useLogger(app.get(Logger));

  await app.startAllMicroservices();
  await app.listen(configSvc.getOrThrow('notifications.httpPort'));
}

bootstrap();
