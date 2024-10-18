import { Injectable } from '@nestjs/common';
import { Logger } from 'winston';
import { createLogger, format, transports } from 'winston';

@Injectable()
export class CustomLoggerService {
  private logger: Logger;

  constructor() {
    this.logger = createLogger({
      level: 'info',
      format: format.combine(
        format.timestamp(),
        format.json(),
      ),
      transports: [
        new transports.Console(),
        new transports.File({ filename: 'application.log' }),
      ],
    });
  }

  log(message: string, meta?: object) {
    this.logger.info(message, meta);
  }

  error(message: string, meta?: object) {
    this.logger.error(message, meta);
  }

  warn(message: string, meta?: object) {
    this.logger.warn(message, meta);
  }
}
