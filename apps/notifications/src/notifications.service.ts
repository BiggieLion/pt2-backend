import { Injectable } from '@nestjs/common';
import { NotifyEmailDto, Params } from './dto/notify-email.dto';
import { ConfigService } from '@nestjs/config';
import { InjectResend } from 'nest-resend';
import { Resend } from 'resend';
import * as templates from './templates';
import { Templates } from './dto/templates.enum';

@Injectable()
export class NotificationsService {
  constructor(
    private readonly configSvc: ConfigService,
    @InjectResend() private readonly resendClient: Resend,
  ) {}

  async notifyEmail(data: NotifyEmailDto) {
    let html = '';

    if (Object.values(Templates).includes(data.template as Templates)) {
      html = this.getHtmlTemplate('defaultTemplate', data?.params);
    } else {
      html = this.getHtmlTemplate(data.template, data.params);
    }

    return this.resendClient.emails.send({
      from: this.configSvc.get('resend.smtp.email'),
      to: data?.email,
      subject: data?.subject,
      html,
    });
  }

  private getHtmlTemplate(template: string, params: Params) {
    return templates[Templates[template]](params);
  }
}
