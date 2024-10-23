import { Module } from '@nestjs/common';
import { RequesterController } from './requester.controller';
import { RequesterService } from './requester.service';
import {
  AUTH_SERVICE,
  ConfigurationModule,
  DatabaseModule,
  LoggerModule,
} from '@app/common';
import { Requester } from './entities/requester.entity';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { RequesterRepository } from './requester.repository';

@Module({
  imports: [
    DatabaseModule,
    DatabaseModule.forFeature([Requester]),
    LoggerModule,
    ConfigurationModule,
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
    ]),
  ],
  controllers: [RequesterController],
  providers: [RequesterService, RequesterRepository],
})
export class RequesterModule {}
