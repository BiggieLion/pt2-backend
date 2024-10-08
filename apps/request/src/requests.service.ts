import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateRequestDto } from './dto/create-request.dto';
import { UpdateRequestDto } from './dto/update-request.dto';
import { RequestRepository } from './request.repository';
import { Request } from './entities/request.entity';
import { NOTIFICATIONS_SERVICE } from '@app/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class RequestsService {
  constructor(
    private readonly requestRepository: RequestRepository,
    @Inject(NOTIFICATIONS_SERVICE)
    private readonly notificationSvc: ClientProxy,
  ) {}

  async create(createRequestDto: CreateRequestDto, email: string) {
    const request = new Request({ ...createRequestDto });
    console.log('<----- before emit ----->');
    this.notificationSvc.emit('notify-email', { email });
    console.log('<----- after emit ----->');
    return {
      data: await this.requestRepository.create(request),
      message: 'Request created successfully',
    };
  }

  async findByRequester(sub: string) {
    const requests = await this.requestRepository.find({ requester_id: sub });
    if (requests.length === 0) {
      throw new NotFoundException('Requests not found');
    }

    return {
      data: requests,
      message: 'Requests found successfully',
    };
  }

  async findByAnalyst(sub: string) {
    const requests = await this.requestRepository.find({ analyst_id: sub });
    if (requests.length === 0) {
      throw new NotFoundException('Requests not found');
    }
    return {
      data: requests,
      message: 'Requests found successfully',
    };
  }

  async findBySupervisor(sub: string) {
    const requests = await this.requestRepository.find({ supervisor_id: sub });
    if (requests.length === 0) {
      throw new NotFoundException('Requests not found');
    }
    return {
      data: requests,
      message: 'Requests found successfully',
    };
  }

  async update(id: number, updateRequestDto: UpdateRequestDto) {
    return {
      data: await this.requestRepository.findOneAndUpdate(
        { id },
        updateRequestDto,
      ),
      message: 'Request updated successfully',
    };
  }

  async remove(id: number) {
    const deleted = await this.requestRepository.findOneAndDelete({ id });
    if (deleted.affected === 0) {
      throw new NotFoundException('Request not found');
    }
    return {
      data: {},
      message: 'Request deleted successfully',
    };
  }
}
