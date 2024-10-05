import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRequestDto } from './dto/create-request.dto';
import { UpdateRequestDto } from './dto/update-request.dto';
import { RequestRepository } from './request.repository';
import { Request } from './entities/request.entity';

@Injectable()
export class RequestsService {
  constructor(private readonly requestRepository: RequestRepository) {}

  async create(createRequestDto: CreateRequestDto) {
    const request = new Request({ ...createRequestDto });
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
    console.log(deleted.affected);
    if (deleted.affected === 0) {
      throw new NotFoundException('Request not found');
    }
    return {
      data: {},
      message: 'Request deleted successfully',
    };
  }
}
