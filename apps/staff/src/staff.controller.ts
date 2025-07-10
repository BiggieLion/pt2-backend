import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
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
  @Roles('analyst')
  @Get('analyst')
  findCurrentAnalyst(@CurrentUser() user) {
    return this.staffSvc.findAnalyst(user?.id);
  }

  @UseGuards(JwtAuthGuard)
  @Roles('supervisor')
  @Get('/analyst/all')
  findAllAnalysts() {
    return this.staffSvc.findAllAnalysts();
  }

  @UseGuards(JwtAuthGuard)
  @Roles('supervisor')
  @Get('analyst/id/:sub')
  findAnalyst(@Param('sub') sub: string) {
    return this.staffSvc.findAnalyst(sub);
  }

  @UseGuards(JwtAuthGuard)
  @Roles('analyst')
  @Patch('analyst')
  updateCurrentAnalyst(
    @CurrentUser() user,
    @Body() updateStaffDto: UpdateStaffDto,
  ) {
    return this.staffSvc.updateAnalyst(user?.id, updateStaffDto);
  }

  @UseGuards(JwtAuthGuard)
  @Roles('supervisor')
  @Patch('analyst/:sub')
  updateAnalyst(
    @Param('sub') sub: string,
    @Body() updateStaffDto: UpdateStaffDto,
  ) {
    return this.staffSvc.updateAnalyst(sub, updateStaffDto);
  }

  @UseGuards(JwtAuthGuard)
  @Roles('supervisor')
  @Delete('analyst/:sub')
  removeAnalyst(@Param('sub') sub: string) {
    return this.staffSvc.removeAnalyst(sub);
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
  findCurrentSupervisor(@CurrentUser() user) {
    return this.staffSvc.findSupervisor(user?.id);
  }

  @UseGuards(JwtAuthGuard)
  @Roles('supervisor')
  @Get('supervisor/:sub')
  findSupervisor(@Param('sub') sub: string) {
    return this.staffSvc.findSupervisor(sub);
  }

  @UseGuards(JwtAuthGuard)
  @Roles('supervisor')
  @Patch('supervisor')
  updateCurrentSupervisor(
    @CurrentUser() user,
    @Body() updateStaffDto: UpdateStaffDto,
  ) {
    return this.staffSvc.updateSupervisor(user?.id, updateStaffDto);
  }

  @UseGuards(JwtAuthGuard)
  @Roles('supervisor')
  @Delete('supervisor/:sub')
  removeSupervisor(@Param('sub') sub: string) {
    return this.staffSvc.removeSupervisor(sub);
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
