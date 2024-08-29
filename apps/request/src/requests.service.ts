import { Injectable } from '@nestjs/common';
import { CreateRequestDto } from './dto/create-request.dto';
import { UpdateRequestDto } from './dto/update-request.dto';
import { RequestRepository } from './request.repository';
import { Request } from './entities/request.entity';

@Injectable()
export class RequestsService {
  constructor(private readonly requestRepository: RequestRepository) {}

  create(createRequestDto: CreateRequestDto) {
    console.log('createRequestDto', createRequestDto);
    const request = new Request({ ...createRequestDto });
    return this.requestRepository.create(request);
  }

  findByAnalyst(id: number) {
    return this.requestRepository.find({ analyst_id: id });
  }

  findBySupervisor(id: number) {
    return this.requestRepository.find({ supervisor_id: id });
  }

  update(id: number, updateRequestDto: UpdateRequestDto) {
    return this.requestRepository.findOneAndUpdate({ id }, updateRequestDto);
  }

  remove(id: number) {
    return this.requestRepository.findOneAndDelete({ id });
  }
}
