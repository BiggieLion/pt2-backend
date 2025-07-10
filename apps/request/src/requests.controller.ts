import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { RequestsService } from './requests.service';
import { CreateRequestDto } from './dto/create-request.dto';
import { UpdateRequestDto } from './dto/update-request.dto';
import { CurrentUser, JwtAuthGuard, Roles, UserDto } from '@app/common';
import { RequestIaDto } from './dto/request-ia.dto';

@Controller('requests')
export class RequestsController {
  constructor(private readonly requestsService: RequestsService) {}

  // TODO: Create endpoint to get requester by ID, and get all the requesters

  @UseGuards(JwtAuthGuard)
  @Roles('requester')
  @Post()
  create(
    @CurrentUser() userInfo: UserDto,
    @Body() createRequestDTO: CreateRequestDto,
  ) {
    createRequestDTO.requester_id = userInfo?.id;

    return this.requestsService.create(
      createRequestDTO,
      userInfo.email,
      userInfo.name,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Roles('requester', 'analyst', 'supervisor')
  @Get(':id')
  findByRequestId(@Param('id') id: string) {
    return this.requestsService.fidByRequestId(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Roles('requester')
  @Get('/requester')
  findAllByCurrentRequester(@CurrentUser() user: UserDto) {
    return this.requestsService.findByRequester(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Roles('analyst', 'supervisor')
  @Get('/requester/:sub')
  findAllByRequester(@Param('sub') sub: string) {
    return this.requestsService.findByRequester(sub);
  }

  @UseGuards(JwtAuthGuard)
  @Roles('analyst')
  @Get('/analyst')
  findAllByCurrentAnalyst(@CurrentUser() user: UserDto) {
    return this.requestsService.findByAnalyst(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Roles('analyst', 'supervisor')
  @Get('/analyst/:sub')
  findAllByAnalyst(@Param('sub') sub: string) {
    return this.requestsService.findByAnalyst(sub);
  }

  @UseGuards(JwtAuthGuard)
  @Roles('supervisor')
  @Get('/supervisor')
  findAllByCurrentSupervisor(@CurrentUser() user: UserDto) {
    return this.requestsService.findBySupervisor(user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Roles('supervisor')
  @Get('/supervisor/:sub')
  findAllBySupervisor(@Param('sub') sub: string) {
    return this.requestsService.findBySupervisor(sub);
  }

  @UseGuards(JwtAuthGuard)
  @Roles('requester', 'analyst', 'supervisor')
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRequestDto: UpdateRequestDto) {
    return this.requestsService.update(+id, updateRequestDto);
  }

  @UseGuards(JwtAuthGuard)
  @Roles('analyst', 'supervisor')
  @Post('/evaluate/:id')
  sendRequestToAI(
    @Param('id') creditId: string,
    @Body() requestIa: RequestIaDto,
  ) {
    return this.requestsService.sendRequestToAI(+creditId, requestIa);
  }

  @UseGuards(JwtAuthGuard)
  @Roles('supervisor')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.requestsService.remove(+id);
  }
}
