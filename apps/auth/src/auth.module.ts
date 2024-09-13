import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { DatabaseModule, LoggerModule } from '@app/common';
import { RequesterModule } from './requester/requester.module';
import { StaffModule } from './staff/staff.module';

@Module({
  imports: [DatabaseModule, RequesterModule, StaffModule, LoggerModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
