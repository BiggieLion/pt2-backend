import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CreateRequesterDto } from './dto/create-requester.dto';
import { RequesterService } from './requester.service';
import { UpdateRequesterDto } from './dto/update-requester.dto';
import { ChangePasswordDto } from '@app/common';
import { CurrentUser, JwtAuthGuard, Roles } from '@app/common';

@Controller('requester')
export class RequesterController {
  constructor(private readonly requesterSvc: RequesterService) {}

  @Post()
  create(@Body() createRequesterDTO: CreateRequesterDto) {
    return this.requesterSvc.create(createRequesterDTO);
  }

  @UseGuards(JwtAuthGuard)
  @Roles('requester', 'analyst', 'supervisor')
  @Get()
  findRequester(@CurrentUser() user) {
    return this.requesterSvc.findRequester(user?.id);
  }

  @UseGuards(JwtAuthGuard)
  @Roles('requester', 'analyst', 'supervisor')
  @Patch()
  update(@CurrentUser() user, @Body() updateRequesterDTO: UpdateRequesterDto) {
    return this.requesterSvc.update(user?.id, updateRequesterDTO);
  }

  @UseGuards(JwtAuthGuard)
  @Roles('requester', 'analyst', 'supervisor')
  @Delete()
  remove(@CurrentUser() user) {
    return this.requesterSvc.remove(user?.id);
  }

  @UseGuards(JwtAuthGuard)
  @Roles('requester')
  @Patch('change-password')
  changePassword(
    @CurrentUser() user,
    @Body() changePasswordDTO: ChangePasswordDto,
  ) {
    return this.requesterSvc.changePassword(user?.id, changePasswordDTO);
  }
}
