import { DatabaseModule } from '@app/common';
import { Module } from '@nestjs/common';
import { Requester } from './entities/requester.entity';
import { RequesterRepository } from './requester.repository';
import { RequesterService } from './requester.service';
import { RequesterController } from './requester.controller';

@Module({
  imports: [DatabaseModule, DatabaseModule.forFeature([Requester])],
  providers: [RequesterRepository, RequesterService],
  controllers: [RequesterController],
})
export class RequesterModule {}
