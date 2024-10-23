import { Module } from '@nestjs/common';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { ConfigurationModule, LoggerModule } from '@app/common';
import { ResendModule } from 'nest-resend';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    LoggerModule,
    ConfigurationModule,
    ResendModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configSvc: ConfigService) => ({
        apiKey: configSvc.get('resend.auth.password'),
      }),
    }),
  ],
  controllers: [NotificationsController],
  providers: [NotificationsService],
})
export class NotificationsModule {}
