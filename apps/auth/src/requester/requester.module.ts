import { DatabaseModule, LoggerModule } from '@app/common';
import { Module } from '@nestjs/common';
import { Requester } from './entities/requester.entity';
import { RequesterRepository } from './requester.repository';

@Module({
  imports: [
    DatabaseModule,
    DatabaseModule.forFeature([Requester]),
    LoggerModule,
  ],
  providers: [RequesterRepository],
})
export class RequesterModule {}
