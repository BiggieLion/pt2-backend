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
  @Roles('requester')
  @Get()
  findCurrentRequester(@CurrentUser() user) {
    return this.requesterSvc.findRequester(user?.id);
  }

  @UseGuards(JwtAuthGuard)
  @Roles('analyst', 'supervisor')
  @Get('/:sub')
  findRequester(@Param('sub') sub: string) {
    return this.requesterSvc.findRequester(sub);
  }

  @UseGuards(JwtAuthGuard)
  @Roles('requester')
  @Patch()
  updateCurrent(
    @CurrentUser() user,
    @Body() updateRequesterDTO: UpdateRequesterDto,
  ) {
    return this.requesterSvc.update(user?.id, updateRequesterDTO);
  }

  @UseGuards(JwtAuthGuard)
  @Roles('analyst', 'supervisor')
  @Patch('/:sub')
  update(
    @Param('sub') sub: string,
    @Body() updateRequesterDTO: UpdateRequesterDto,
  ) {
    return this.requesterSvc.update(sub, updateRequesterDTO);
  }

  @UseGuards(JwtAuthGuard)
  @Roles('requester')
  @Delete()
  removeCurrent(@CurrentUser() user) {
    return this.requesterSvc.remove(user?.id);
  }

  @UseGuards(JwtAuthGuard)
  @Roles('supervisor')
  @Delete('/:sub')
  remove(@Param('sub') sub: string) {
    return this.requesterSvc.remove(sub);
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
