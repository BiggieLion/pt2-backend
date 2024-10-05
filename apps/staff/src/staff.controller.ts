import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { StaffService } from './staff.service';
import { CreateStaffDto } from './dto/create-staff.dto';
import { UpdateStaffDto } from './dto/update-staff.dto';
import { CurrentUser, JwtAuthGuard, Roles } from '@app/common';
import { ChangePasswordDto } from '@app/common';

@Controller('staff')
export class StaffController {
  constructor(private readonly staffSvc: StaffService) {}

  // Analyst
  @UseGuards(JwtAuthGuard)
  @Roles('supervisor')
  @Post('analyst')
  createAnalyst(@Body() createStaffDto: CreateStaffDto) {
    return this.staffSvc.createAnalyst(createStaffDto);
  }

  @UseGuards(JwtAuthGuard)
  @Roles('analyst', 'supervisor')
  @Get('analyst')
  findAnalyst(@CurrentUser() user) {
    return this.staffSvc.findAnalyst(user?.id);
  }

  @UseGuards(JwtAuthGuard)
  @Roles('analyst', 'supervisor')
  @Patch('analyst')
  updateAnalyst(@CurrentUser() user, @Body() updateStaffDto: UpdateStaffDto) {
    return this.staffSvc.updateAnalyst(user?.id, updateStaffDto);
  }

  @UseGuards(JwtAuthGuard)
  @Roles('supervisor')
  @Delete('analyst')
  removeAnalyst(@CurrentUser() user) {
    return this.staffSvc.removeAnalyst(user?.id);
  }

  //Supervisor
  @UseGuards(JwtAuthGuard)
  @Roles('supervisor')
  @Post('supervisor')
  createSupervisor(@Body() createStaffDto: CreateStaffDto) {
    return this.staffSvc.createSupervisor(createStaffDto);
  }

  @UseGuards(JwtAuthGuard)
  @Roles('supervisor')
  @Get('supervisor')
  findSupervisor(@CurrentUser() user) {
    return this.staffSvc.findSupervisor(user?.id);
  }

  @UseGuards(JwtAuthGuard)
  @Roles('supervisor')
  @Patch('supervisor')
  updateSupervisor(
    @CurrentUser() user,
    @Body() updateStaffDto: UpdateStaffDto,
  ) {
    return this.staffSvc.updateSupervisor(user?.id, updateStaffDto);
  }

  @UseGuards(JwtAuthGuard)
  @Roles('supervisor')
  @Delete('supervisor')
  removeSupervisor(@CurrentUser() user) {
    return this.staffSvc.removeSupervisor(user?.id);
  }

  @UseGuards(JwtAuthGuard)
  @Roles('analyst', 'supervisor')
  @Patch('change-password')
  changePassword(
    @CurrentUser() userInfo,
    @Body() chancePasswordDTO: ChangePasswordDto,
  ) {
    return this.staffSvc.changePassword(userInfo?.id, chancePasswordDTO);
  }
}
