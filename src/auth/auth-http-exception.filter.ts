import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class AuthHttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(AuthHttpExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const exceptionResponse = exception.getResponse();

    this.logger.log(exceptionResponse);
    this.logger.log(exception.getStatus());
    this.logger.log('Произошла ошибка');

    response.status(exception.getStatus()).json(exception);

    // if (exceptionResponse?.message?.includes('email must be an email')) {
    //   response.status(exception.getStatus()).json({
    //     code: 'login_user',
    //     message:
    //       'Извините, но этот email похож на email курильщика, попробуйте другой',
    //     data: {
    //       status: false,
    //       code: 401,
    //     },
    //   });
    // } else {
    //   response.status(exception.getStatus()).json(exceptionResponse);
    // }
  }
}
