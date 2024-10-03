import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ConfigurationModule, DatabaseModule, LoggerModule } from '@app/common';
import { RequesterModule } from './requester/requester.module';
import { StaffModule } from './staff/staff.module';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategy/jwt.strategy';

@Module({
  imports: [
    DatabaseModule,
    RequesterModule,
    StaffModule,
    LoggerModule,
    ConfigurationModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
