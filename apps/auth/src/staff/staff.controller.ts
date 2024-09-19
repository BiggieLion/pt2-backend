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

  @Get('health')
  health() {
    return 'Healthy';
  }

  @Post()
  create(@Body() createStaffDTO: CreateStaffDto) {
    return this.staffSvc.create(createStaffDTO);
  }

  @Get(':id')
  findStaff(@Param('id') id: string) {
    return this.staffSvc.findStaff(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStaffDTO: UpdateStaffDto) {
    return this.staffSvc.update(+id, updateStaffDTO);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.staffSvc.remove(+id);
  }
}
