import { DatabaseModule, LoggerModule } from '@app/common';
import { Module } from '@nestjs/common';
import { Staff } from './entities/staff.entity';
import { Analyst } from './entities/analyst.entity';
import { Supervisor } from './entities/supervisor.entity';
import { StaffRepository } from './staff.repository';

@Module({
  imports: [
    DatabaseModule,
    DatabaseModule.forFeature([Staff, Analyst, Supervisor]),
    LoggerModule,
  ],
  providers: [StaffRepository],
})
export class StaffModule {}
