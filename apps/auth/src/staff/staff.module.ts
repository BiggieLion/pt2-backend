import { DatabaseModule } from '@app/common';
import { Module } from '@nestjs/common';
import { Staff } from './entities/staff.entity';
import { Analyst } from './entities/analyst.entity';
import { Supervisor } from './entities/supervisor.entity';
import { StaffRepository } from './staff.repository';
import { StaffController } from './staff.controller';
import { StaffService } from './staff.service';

@Module({
  imports: [
    DatabaseModule,
    DatabaseModule.forFeature([Staff, Analyst, Supervisor]),
  ],
  providers: [StaffRepository, StaffService],
  controllers: [StaffController],
})
export class StaffModule {}
