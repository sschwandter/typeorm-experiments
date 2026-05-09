import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class LoggerFactory {
  create(context: string): Logger {
    return new Logger(context);
  }
}
