import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { RequestsService } from './requests.service';
import { CreateRequestDto } from './dto/create-request.dto';
import { UpdateRequestDto } from './dto/update-request.dto';

@Controller('requests')
export class RequestsController {
  constructor(private readonly requestsService: RequestsService) {}

  @Get('health')
  health() {
    return 'Healthy';
  }

  @Post()
  create(@Body() createRequestDto: CreateRequestDto) {
    return this.requestsService.create(createRequestDto);
  }

  @Get(':analyst_id')
  findAllByAnalyst(@Param('analyst_id') id: number) {
    return this.requestsService.findByAnalyst(id);
  }

  @Get('/supervisor/:supervisor_id')
  findAllBySupervisor(@Param('supervisor_id') id: number) {
    return this.requestsService.findBySupervisor(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRequestDto: UpdateRequestDto) {
    return this.requestsService.update(+id, updateRequestDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.requestsService.remove(+id);
  }
}
