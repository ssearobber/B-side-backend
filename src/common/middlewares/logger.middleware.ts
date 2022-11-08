import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger('http');
  use(req: Request, res: Response, next: NextFunction) {
    this.logger.log(req.url, req.method);
    next();
  }
}
