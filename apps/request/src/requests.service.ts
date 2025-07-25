import {
  BadRequestException,
  HttpException,
  HttpStatus,
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

  private filterSensitiveData(requester: any): any {
    if (!requester) return {};

    const { email, password, ...filteredData } = requester;

    return filteredData;
  }

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

  async getLastCreditId() {
    let lastId: number;
    try {
      const lastCredit: Request = await this.requestRepository.findOne(
        {},
        { id: true },
        {},
        { id: 'DESC' },
      );
      lastId = lastCredit?.id;
    } catch (e) {
      lastId = 0;
    }

    return {
      message: 'Last credit id found successfully',
      data: { lastId },
    };
  }

  async fidByRequestId(id: number) {
    if (!id || id <= 0) throw new BadRequestException('Request ID not valid');

    const request: Request = await this.requestRepository.findOne({ id });

    if (!request) throw new NotFoundException('Request not found');

    try {
      const requester = await lastValueFrom(
        this.requesterSvc.send('get-requester', request.requester_id),
      );
      const filteredRequester = this.filterSensitiveData(requester);

      return {
        message: 'Request found successfully',
        data: {
          ...request,
          ...filteredRequester,
        },
      };
    } catch (e) {
      throw new HttpException(
        `Error obtaining requester information: ${e}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
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
    if (updateRequestDto?.chat && updateRequestDto?.chat?.length > 0) {
      const chatSent: Request = await this.requestRepository.findOne(
        { id },
        { chat: true },
      );
      if (chatSent?.chat && chatSent?.chat?.length > 0) {
        updateRequestDto.chat = [...chatSent?.chat, ...updateRequestDto?.chat];
      }
    }
    if (updateRequestDto?.status) {
      const request: Request = await this.requestRepository.findOne(
        { id },
        { requester_id: true },
      );
      const requester: any = await lastValueFrom(
        this.requesterSvc.send('get-email', request?.requester_id),
      );
      if (updateRequestDto?.status === 3) {
        this.notificationSvc.emit('notify-email', {
          email: requester?.email,
          template: 'REQUEST_APPROVED',
          subject: 'Solicitud aprobada',
          params: {
            name: `${requester?.firstname} ${requester?.lastname}`,
            id,
          },
        });
      } else if (updateRequestDto?.status === 4) {
        this.notificationSvc.emit('notify-email', {
          email: requester?.email,
          template: 'REQUEST_REJECTED',
          subject: 'Solicitud rechazada',
          params: {
            name: `${requester?.firstname} ${requester?.lastname}`,
            id,
          },
        });
      }
    }
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
      await this.requestRepository.findOneAndUpdate(
        { id: creditId },
        { score: score, status: 4 },
      );
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
          { status: 4, score: score?.data?.score },
        );
        this.notificationSvc.emit('notify-email', {
          email: requester?.email,
          template: 'REQUEST_PREREJECTED',
          subject: 'Solicitud pre-rechazada',
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
          { status: 2, score: score?.data?.score },
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
          { status: 2, score: score?.data?.score },
        );
        this.notificationSvc.emit('notify-email', {
          email: requester?.email,
          template: 'REQUEST_PREAPPROVED',
          subject: 'Solicitud pre-aprobada',
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
