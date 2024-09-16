import { Injectable } from '@nestjs/common';
import { RequesterRepository } from './requester.repository';
import { CreateRequesterDto } from './dto/create-requester.dto';
import { Requester } from './entities/requester.entity';
import { UpdateRequesterDto } from './dto/update-requester.dto';

@Injectable()
export class RequesterService {
  constructor(private readonly requesterRepository: RequesterRepository) {}

  create(createRequesterDTO: CreateRequesterDto) {
    const requester = new Requester({ ...createRequesterDTO });
    return this.requesterRepository.create(requester);
  }

  findRequester(id: number) {
    return this.requesterRepository.findOne({ id });
  }

  update(id: number, updateRequesterDTO: UpdateRequesterDto) {
    return this.requesterRepository.findOneAndUpdate(
      { id },
      updateRequesterDTO,
    );
  }

  remove(id: number) {
    return this.requesterRepository.findOneAndDelete({ id });
  }
}
