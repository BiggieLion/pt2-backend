import { Module } from '@nestjs/common';
import { DocumentsController } from './documents.controller';
import { DocumentsService } from './documents.service';
import { AUTH_SERVICE, ConfigurationModule, LoggerModule } from '@app/common';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    LoggerModule,
    ConfigurationModule,
    ThrottlerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configSvc: ConfigService) => [
        {
          ttl: configSvc.get('throttler.ttl'),
          limit: configSvc.get('throttler.limit'),
        },
      ],
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
    ]),
  ],
  controllers: [DocumentsController],
  providers: [
    DocumentsService,
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
export class DocumentsModule {}
