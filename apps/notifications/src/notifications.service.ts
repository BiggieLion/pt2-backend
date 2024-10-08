import * as nodemailer from 'nodemailer';
import { Injectable } from '@nestjs/common';
import { NotifyEmailDto } from './dto/notify-email.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class NotificationsService {
  constructor(private readonly configSvc: ConfigService) {}

  private readonly transporter = nodemailer.createTransport({
    host: 'smtp.resend.com',
    port: 465,
    secure: true,
    auth: {
      user: 'resend',
      pass: this.configSvc.getOrThrow('resend.apiKey'),
    },
  });

  async notifyEmail(data: NotifyEmailDto) {
    console.log('<---- data ----->', data);
    await this.transporter.sendMail({
      from: 'PT2 Backend <no-reply@pt2.fun>',
      to: 'hleonr1300@gmail.com',
      subject: 'Test email from PT2 Backend',
      html: '<h1>This is a mail test</h1> <h3>This mail is from a Degree Project</h3>',
    });
  }
}
