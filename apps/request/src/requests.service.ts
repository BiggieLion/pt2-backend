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
import { NOTIFICATIONS_SERVICE, REQUESTER_SERVICE } from '@app/common';
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
    @Inject(REQUESTER_SERVICE)
    private readonly requesterSvc: ClientProxy,
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

  async fidByRequestId(id: number) {
    return {
      message: 'Request found successfully',
      data: (await this.requestRepository.findOne({ id })) || {},
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

  async findAllRequests() {
    const requests = await this.requestRepository.find();
    if (requests.length === 0) {
      throw new NotFoundException('Requests not found');
    }
    return {
      message: 'Requests found successfully',
      data: requests,
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
    const request: Request = await this.requestRepository.findOne(
      { id: creditId },
      { requester_id: true },
    );
    const requester: any = await lastValueFrom(
      this.requesterSvc.send('get-email', request?.requester_id),
    );
    if (requestIaDto.relation) {
      score = Math.floor(Math.random() * 15) + 1;
      message = 'Relation effort to big to be analyzed by AI';
      this.notificationSvc.emit('notify-email', {
        email: requester?.email,
        template: 'REQUEST_REJECTED',
        subject: 'Solicitud rechazada',
        params: {
          name: `${requester?.firstname} ${requester?.lastname}`,
          creditId,
          reasonOfRejection:
            'La relación de esfuerzo es demasiado grande para ser analizada por el modelo de inteligencia artificial.',
          iaScore: score,
        },
      });
    } else {
      message = 'Score got from AI model';
      score = await lastValueFrom(
        this.httpSvc.post(
          this.configSvc.getOrThrow('http_urls.ai'),
          requestIaDto,
        ),
      ).catch((err: AxiosError) => {
        console.error('Error sending request to AI model', err.message);
        throw new HttpException(
          { message: `Error sending request to AI model: ${err.message}` },
          err.status,
        );
      });
      if (
        score?.data?.score &&
        score?.data?.score >= 0 &&
        score?.data?.score <= 40
      ) {
        await this.requestRepository.findOneAndUpdate(
          { id: creditId },
          { status: 4 },
        );
        this.notificationSvc.emit('notify-email', {
          email: requester?.email,
          template: 'REQUEST_REJECTED',
          subject: 'Solicitud rechazada',
          params: {
            name: `${requester?.firstname} ${requester?.lastname}`,
            creditId,
            iaScore: score?.data?.score,
            reasonOfRejection:
              'El puntaje obtenido por el modelo de IA fue demasiado bajo.',
          },
        });
      } else if (
        score?.data?.score &&
        score?.data?.score >= 41 &&
        score?.data?.score <= 60
      ) {
        await this.requestRepository.findOneAndUpdate(
          { id: creditId },
          { status: 2 },
        );
        this.notificationSvc.emit('notify-email', {
          email: requester?.email,
          template: 'REQUEST_EVALUATION',
          subject: 'Solicitud en evaluacion por un analista',
          params: {
            name: `${requester?.firstname} ${requester?.lastname}`,
            creditId,
            iaScore: score?.data?.score,
          },
        });
      } else if (
        score?.data?.score &&
        score?.data?.score >= 61 &&
        score?.data?.score <= 100
      ) {
        await this.requestRepository.findOneAndUpdate(
          { id: creditId },
          { status: 2 },
        );
        this.notificationSvc.emit('notify-email', {
          email: requester?.email,
          template: 'REQUEST_APPROVED',
          subject: 'Solicitud pre-aceptada',
          params: {
            name: `${requester?.firstname} ${requester?.lastname}`,
            creditId,
            iaScore: score?.data?.score,
          },
        });
      }
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
