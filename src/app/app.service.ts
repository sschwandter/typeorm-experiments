import { Injectable, Logger } from '@nestjs/common';
import { LoggerFactory } from '../logging/logger.factory';

@Injectable()
export class AppService {
  private readonly logger: Logger;

  constructor(loggerFactory: LoggerFactory) {
    this.logger = loggerFactory.create(AppService.name);
  }

  getHello(): string {
    this.logger.log('Serving hello response');

    return 'Hello World!';
  }
}
