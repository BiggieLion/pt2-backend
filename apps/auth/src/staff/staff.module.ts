import { DatabaseModule } from '@app/common';
import { Module } from '@nestjs/common';
import { Staff } from './entities/staff.entity';
import { StaffRepository } from './staff.repository';
import { StaffController } from './staff.controller';
import { StaffService } from './staff.service';

@Module({
  imports: [DatabaseModule, DatabaseModule.forFeature([Staff])],
  providers: [StaffRepository, StaffService],
  controllers: [StaffController],
})
export class StaffModule {}
