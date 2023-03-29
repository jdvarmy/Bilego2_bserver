import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { CustomHttpExceptionResponse } from '../types/types';
import fs from 'fs';
import { IncomingHttpHeaders } from 'http';

type CustomHttpResponse = Omit<
  CustomHttpExceptionResponse,
  'message' | 'error' | 'statusCode' | 'headers'
> & {
  reqHeaders: IncomingHttpHeaders;
  resHeaders: IncomingHttpHeaders;
  request?: Request;
  response?: Response;
};

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const log: CustomHttpResponse = {
      path: req.url,
      method: req.method,
      ip: req.ip,
      reqHeaders: req.headers,
      resHeaders: req.headers,
      body: req.body,
      timeStamp: new Date(),
    };

    this.writeLogToFile(log);
    next();
  }

  private writeLogToFile = (log: CustomHttpResponse): void => {
    const errorLog = this.getLog(log);
    fs.appendFile('error.log', errorLog, 'utf8', (err) => {
      if (err) throw err;
    });
  };

  private getLog = (res: CustomHttpResponse): string => {
    const { path, method, ip, reqHeaders, resHeaders, timeStamp } = res;

    return `[${ip}] Method: ${method} - URL: ${path}
    Request Headers: ${JSON.stringify(reqHeaders)}
    Response Headers: ${JSON.stringify(resHeaders)}
    [${timeStamp}]\n`;
  };
}
