import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateRequesterDto } from './dto/create-requester.dto';
import { RequesterService } from './requester.service';
import { UpdateRequesterDto } from './dto/update-requester.dto';

@Controller('requester')
export class RequesterController {
  constructor(private readonly requesterSvc: RequesterService) {}

  @Get('health')
  health() {
    return 'Healthy';
  }

  @Post()
  create(@Body() createRequesterDTO: CreateRequesterDto) {
    return this.requesterSvc.create(createRequesterDTO);
  }

  @Get(':id')
  findRequester(@Param('id') id: string) {
    return this.requesterSvc.findRequester(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateRequesterDTO: UpdateRequesterDto,
  ) {
    return this.requesterSvc.update(+id, updateRequesterDTO);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.requesterSvc.remove(+id);
  }
}
