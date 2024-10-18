import { Injectable, NestMiddleware, LoggerService } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { CustomLoggerService } from '../loggers/logger.service';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(private readonly logger: CustomLoggerService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const { method, url, body } = req;
    const start = Date.now();

    this.logger.log(`Incoming Request: ${method} ${url}`, body);

    res.on('finish', () => {
      const duration = Date.now() - start;
      const { statusCode } = res;
      this.logger.log(`Outgoing Response: ${method} ${url} - ${statusCode} (${duration}ms)`);
    });

    next();
  }
}
