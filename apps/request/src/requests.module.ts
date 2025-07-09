import { Module } from '@nestjs/common';
import { RequestsController } from './requests.controller';
import { RequestsService } from './requests.service';
import { DatabaseModule, LoggerModule } from '@app/common';
import { Request } from './entities/request.entity';
import { RequestRepository } from './request.repository';
import { ClientsModule, Transport } from '@nestjs/microservices';
import {
  AUTH_SERVICE,
  NOTIFICATIONS_SERVICE,
} from '@app/common/constants/services.constants';
import { ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    DatabaseModule,
    DatabaseModule.forFeature([Request]),
    LoggerModule,
    HttpModule.register({
      timeout: 10000,
    }),
    ClientsModule.registerAsync([
      {
        name: AUTH_SERVICE,
        useFactory: (configSvc: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configSvc.getOrThrow('microservices.auth.host'),
            port: configSvc.getOrThrow('microservices.auth.port'),
          },
        }),
        inject: [ConfigService],
      },
      {
        name: NOTIFICATIONS_SERVICE,
        useFactory: (configSvc: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configSvc.getOrThrow('microservices.notifications.host'),
            port: configSvc.getOrThrow('microservices.notifications.port'),
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  controllers: [RequestsController],
  providers: [RequestsService, RequestRepository],
})
export class RequestsModule {}
