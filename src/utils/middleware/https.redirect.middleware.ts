import { HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { NODE_ENV } from '../types/constants/env';
import fs from 'fs';

@Injectable()
export class HttpsRedirectMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: () => void) {
    const log = `req.protocol = ${req.protocol}
    req.secure = ${req.secure}
    \n`;

    fs.appendFile('logger.log', log, 'utf8', (err) => {
      if (err) throw err;
    });

    if (NODE_ENV === 'production' && (!req.secure || req.protocol === 'http')) {
      // res.redirect(
      //   HttpStatus.PERMANENT_REDIRECT,
      //   `https://${req.hostname}${req.originalUrl}`,
      // );
    } else {
      // next();
    }

    next();
  }
}
