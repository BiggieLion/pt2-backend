import {
  HttpException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateRequestDto } from './dto/create-request.dto';
import { UpdateRequestDto } from './dto/update-request.dto';
import { RequestRepository } from './request.repository';
import { Request } from './entities/request.entity';
import { NOTIFICATIONS_SERVICE } from '@app/common';
import { ClientProxy } from '@nestjs/microservices';
import { RequestIaDto } from './dto/request-ia.dto';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { lastValueFrom } from 'rxjs';
import { AxiosError } from 'axios';

@Injectable()
export class RequestsService {
  constructor(
    private readonly requestRepository: RequestRepository,
    private readonly configSvc: ConfigService,
    private readonly httpSvc: HttpService,
    @Inject(NOTIFICATIONS_SERVICE)
    private readonly notificationSvc: ClientProxy,
  ) {}

  async create(
    createRequestDto: CreateRequestDto,
    email: string,
    name: string,
  ) {
    const request = new Request({ ...createRequestDto });
    const requestSaved = await this.requestRepository.create(request);
    this.notificationSvc.emit('notify-email', {
      email,
      template: 'REQUEST_CREATED',
      subject: 'Solicitud creada',
      params: { name, creditId: requestSaved.id },
    });
    return {
      data: requestSaved,
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

  async sendRequestToAI(creditId: number, requestIaDto: RequestIaDto) {
    let score: number | any;
    let message: string;
    if (requestIaDto.relation) {
      score = Math.floor(Math.random() * 15) + 1;
      message = 'Relation effort to big to be analyzed by AI';
    } else {
      message = 'Score got from AI model';
      score = await lastValueFrom(
        this.httpSvc.post(
          this.configSvc.getOrThrow('http_urls.ai'),
          requestIaDto,
        ),
      ).catch((err: AxiosError) => {
        console.error('Error sending request to AI', err.message);
        throw new HttpException(
          { message: `Error getting score: ${err.message}` },
          err.status,
        );
      });
    }

    return {
      data: { score: score?.data?.score || score },
      message,
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
