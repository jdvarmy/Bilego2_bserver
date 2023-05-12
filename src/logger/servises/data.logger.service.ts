import {
  ConsoleLogger,
  HttpStatus,
  Inject,
  Injectable,
  Scope,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { LoggerMessageType } from '../../utils/types/enums';
import { InjectRepository } from '@nestjs/typeorm';
import { LoggerEntries } from '../../database/entity';
import { Repository } from 'typeorm';

@Injectable({ scope: Scope.REQUEST })
export class DataLoggerService extends ConsoleLogger {
  constructor(
    @Inject(REQUEST) private readonly request: Request,

    @InjectRepository(LoggerEntries)
    private readonly loggerEntriesRepo: Repository<LoggerEntries>,
  ) {
    super();
  }

  dbLog(message: string, status: [HttpStatus, string] = [HttpStatus.OK, 'Ok']) {
    this.log(message);

    delete this.request?.body?.password;
    delete this.request?.headers?.cookie;

    const log = this.loggerEntriesRepo.create({
      type: LoggerMessageType.log,
      ip: this.request.ip,
      status: `${status[0]} ${status[1]}`,
      message,
      request: `${this.request.method} ${this.request.url}`,
      headers: JSON.stringify(this.request.headers),
      body: JSON.stringify(this.request.body),
    });

    this.loggerEntriesRepo.save(log);
  }
}
