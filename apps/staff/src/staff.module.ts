import { Module } from '@nestjs/common';
import { StaffController } from './staff.controller';
import { StaffService } from './staff.service';
import { AUTH_SERVICE, DatabaseModule, LoggerModule } from '@app/common';
import { Staff } from './entities/staff.entity';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { StaffRepository } from './staff.repository';

@Module({
  imports: [
    DatabaseModule,
    DatabaseModule.forFeature([Staff]),
    LoggerModule,
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
  controllers: [StaffController],
  providers: [StaffService, StaffRepository],
})
export class StaffModule {}
