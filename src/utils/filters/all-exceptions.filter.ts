import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import * as fs from 'fs';
import { IncomingHttpHeaders } from 'http';
import { isHttpExceptionResponse } from '../types/tsGuards';
import { InjectRepository } from '@nestjs/typeorm';
import { LoggerEntries } from '../../typeorm';
import { Repository } from 'typeorm';
import { LoggerMessageType } from '../types/enums';
import { logMessageMap } from '../../logger/logMessageMap';

export interface HttpExceptionResponse {
  statusCode: HttpStatus;
  error: string;
  message: string | number;
}
export interface CustomHttpExceptionResponse extends HttpExceptionResponse {
  ip: string;
  path: string;
  method: string;
  headers: IncomingHttpHeaders;
  body: XMLHttpRequestBodyInit;
  timeStamp: Date;
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(
    @InjectRepository(LoggerEntries)
    private readonly loggerEntries: Repository<LoggerEntries>,
  ) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status: HttpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
    const message = 'Critical internal server error occurred!';
    let errorResponse: HttpExceptionResponse = {
      statusCode: status,
      message,
      error: 'Internal Server Error',
    };

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const localErrorResponse = exception.getResponse();

      if (isHttpExceptionResponse(localErrorResponse)) {
        errorResponse = localErrorResponse;
      } else if (typeof localErrorResponse === 'string') {
        errorResponse.message = localErrorResponse;
      }
    }

    const error: CustomHttpExceptionResponse = {
      ...errorResponse,
      statusCode: status,
      path: request.url,
      method: request.method,
      ip: request.ip,
      headers: request.headers,
      body: request.body,
      timeStamp: new Date(),
    };

    this.writeToDb(error);

    response.status(status).json({
      ...errorResponse,
      message:
        errorResponse.statusCode === HttpStatus.INTERNAL_SERVER_ERROR
          ? message
          : errorResponse.message,
    });
  }

  private writeToDb = async (
    props: CustomHttpExceptionResponse,
  ): Promise<void> => {
    const { ip, statusCode, error, message, method, path, headers, body } =
      props;

    try {
      const log = this.loggerEntries.create({
        type: LoggerMessageType.error,
        ip,
        status: `${statusCode} ${error}`,
        message: logMessageMap(statusCode, message),
        request: `${method} ${path}`,
        headers: JSON.stringify(headers),
        body: JSON.stringify(body),
      });
      await this.loggerEntries.save(log);
    } catch (e) {
      throw new InternalServerErrorException(e.message ?? e.error);
    }
  };

  private writeErrorLogToFile = (error: CustomHttpExceptionResponse): void => {
    const errorLog = this.getErrorLog(error);
    fs.appendFile('error.log', errorLog, 'utf8', (err) => {
      if (err) throw err;
    });
  };

  private getErrorLog = (
    errorResponse: CustomHttpExceptionResponse,
  ): string => {
    const { statusCode, path, method, message, error, ip, headers, timeStamp } =
      errorResponse;

    return `[${ip}] Response Code: ${statusCode} - Method: ${method} - URL: ${path}
    Error: ${error} - Message: ${message} - Headers: ${JSON.stringify(headers)}
    [${timeStamp}]\n`;
  };
}
