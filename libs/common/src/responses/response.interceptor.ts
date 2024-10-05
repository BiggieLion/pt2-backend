import {
  CallHandler,
  ExecutionContext,
  HttpException,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { catchError, map, Observable, throwError } from 'rxjs';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const res = context.switchToHttp().getResponse();
    const { statusCode } = res;

    return next.handle().pipe(
      map((data) => ({
        statusCode,
        success: statusCode >= 400 ? false : true,
        timestamp: Date.now(),
        path: req.url,
        action: statusCode >= 400 ? 'CANCEL' : 'CONTINUE',
        message: data?.message || 'Request successful',
        data: data?.data || {},
      })),
      catchError((err) => {
        const statusCode = err instanceof HttpException ? err.getStatus() : 500;

        const errorResponse = {
          statusCode,
          success: false,
          timestamp: Date.now(),
          path: req.url,
          action: 'CANCEL',
          message:
            err?.response?.message || err?.message || 'Internal Server Error',
          data: {},
        };

        return throwError(() => new HttpException(errorResponse, statusCode));
      }),
    );
  }
}
