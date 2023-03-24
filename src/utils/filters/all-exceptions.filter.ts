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
    let errorResponse: HttpExceptionResponse = {
      statusCode: status,
      message: 'Critical internal server error occurred!',
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
      timeStamp: new Date(),
    };
    const errorLog = this.getErrorLog(error);

    // this.writeErrorLogToFile(errorLog);
    this.writeToDb(error);

    response.status(status).json(errorResponse);
  }

  private getErrorLog = (
    errorResponse: CustomHttpExceptionResponse,
  ): string => {
    const { statusCode, path, method, message, error, ip, headers, timeStamp } =
      errorResponse;

    return `[${ip}] Response Code: ${statusCode} - Method: ${method} - URL: ${path}
    Error: ${error} - Message: ${message} - Headers: ${JSON.stringify(headers)}
    [${timeStamp}]\n`;
  };

  private writeToDb = async ({
    ip,
    statusCode,
    error,
    message,
    method,
    path,
    headers,
  }: CustomHttpExceptionResponse): Promise<void> => {
    try {
      const log = this.loggerEntries.create({
        type: LoggerMessageType.error,
        ip,
        status: `${statusCode} ${error}`,
        message: message.toString(),
        request: `${method} ${path}`,
        headers: JSON.stringify(headers),
      });
      await this.loggerEntries.save(log);
    } catch (e) {
      throw new InternalServerErrorException(e.message ?? e.error);
    }
  };

  private writeErrorLogToFile = (errorLog: string): void => {
    fs.appendFile('error.log', errorLog, 'utf8', (err) => {
      if (err) throw err;
    });
  };
}
