import { Module } from '@nestjs/common';
import { RequestsController } from './requests.controller';
import { RequestsService } from './requests.service';
import { DatabaseModule, LoggerModule } from '@app/common';
import { Request } from './entities/request.entity';
import { RequestRepository } from './request.repository';

@Module({
  imports: [DatabaseModule, DatabaseModule.forFeature([Request]), LoggerModule],
  controllers: [RequestsController],
  providers: [RequestsService, RequestRepository],
})
export class RequestsModule {}
