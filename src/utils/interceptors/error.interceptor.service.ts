import {
  CallHandler,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
  NestInterceptor,
} from '@nestjs/common';
import { catchError, Observable } from 'rxjs';
import { HttpException } from '@nestjs/common/exceptions/http.exception';

@Injectable()
export class ErrorInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((error) => {
        console.log('ErrorInterceptor');
        // todo: записывать ошибки в бд для дальнейшего отлова
        if ('sqlState' in error) {
          switch (error.code) {
            case 'ER_DUP_ENTRY':
              throw new InternalServerErrorException(
                'Ошибка базы данных. Обнаружен дубликат записи',
              );
            default:
              throw new InternalServerErrorException('Ошибка базы данных');
          }
        }

        throw new HttpException(error.response, error.status);
      }),
    );
  }
}
