import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { StaffService } from './staff.service';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';

@Controller('staff')
export class StaffController {
  constructor(private readonly staffSvc: StaffService) {}

  // Analyst
  @Post('analyst')
  createAnalyst(@Body() createStaffDto: CreateStaffDto) {
    return this.staffSvc.createAnalyst(createStaffDto);
  }

  @Get('analyst/:id')
  findAnalyst(@Param('id') id: string) {
    return this.staffSvc.findAnalyst(+id);
  }

  @Patch('analyst/:id')
  updateAnalyst(
    @Param('id') id: string,
    @Body() updateStaffDto: UpdateStaffDto,
  ) {
    return this.staffSvc.updateAnalyst(+id, updateStaffDto);
  }

  @Delete('analyst/:id')
  removeAnalyst(@Param('id') id: string) {
    return this.staffSvc.removeAnalyst(+id);
  }

  //Supervisor
  @Post('supervisor')
  createSupervisor(@Body() createStaffDto: CreateStaffDto) {
    return this.staffSvc.createSupervisor(createStaffDto);
  }

  @Get('supervisor/:id')
  findSupervisor(@Param('id') id: string) {
    return this.staffSvc.findSupervisor(+id);
  }

  @Patch('supervisor/:id')
  updateSupervisor(
    @Param('id') id: string,
    @Body() updateStaffDto: UpdateStaffDto,
  ) {
    return this.staffSvc.updateSupervisor(+id, updateStaffDto);
  }

  @Delete('supervisor/:id')
  removeSupervisor(@Param('id') id: string) {
    return this.staffSvc.removeSupervisor(+id);
  }
}
