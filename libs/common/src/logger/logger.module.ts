import { Module } from '@nestjs/common';
import { LoggerModule as PinoLoggerModule } from 'nestjs-pino';

@Module({
  imports: [
    PinoLoggerModule.forRoot({
      pinoHttp: {
        timestamp: () => {
          const now = new Date();
          const formattedDate = now.toLocaleDateString('es-MX', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
          });
          const formattedTime = now.toLocaleTimeString('es-MX', {
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            hour12: true,
          });

          return ` "time": "${formattedDate} at ${formattedTime}"`;
        },
        formatters: {
          level: (label) => {
            return { level: label.toUpperCase() };
          },
        },
        redact: {
          paths: ['req.headers.authorization', 'req.headers.cookie'],
          censor: '[REDACTED]',
        },
        transport: {
          target: 'pino-pretty',
          options: {
            singleLine: false,
            levelFirst: true,
            colorize: true,
            translateTime: true,
            messageFormat: '[Pino] {pid} -> {time}: {msg}',
            ignore: 'time,level,pid,hostname',
            customLevels: {
              trace: 'gray',
              debug: 'cyan',
              info: 'green',
              warn: 'yellow',
              error: 'red',
            },
          },
        },
      },
    }),
  ],
})
export class LoggerModule {}
