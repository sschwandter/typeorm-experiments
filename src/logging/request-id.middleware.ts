import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { NextFunction, Request, Response } from 'express';
import { requestContext } from './request-context';
import { LoggerFactory } from './logger.factory';

const requestIdHeader = 'x-request-id';

@Injectable()
export class RequestIdMiddleware implements NestMiddleware {
  private readonly logger: Logger;

  constructor(loggerFactory: LoggerFactory) {
    this.logger = loggerFactory.create(RequestIdMiddleware.name);
  }

  use(request: Request, response: Response, next: NextFunction) {
    const incomingRequestId = request.header(requestIdHeader);
    const requestId = incomingRequestId || randomUUID();

    response.setHeader(requestIdHeader, requestId);

    requestContext.run({ requestId }, () => {
      const startedAt = process.hrtime.bigint();

      response.on('finish', () => {
        const durationMs =
          Number(process.hrtime.bigint() - startedAt) / 1_000_000;

        this.logger.log({
          message: 'HTTP request completed',
          method: request.method,
          path: request.originalUrl,
          statusCode: response.statusCode,
          durationMs: Number(durationMs.toFixed(2)),
        });
      });

      next();
    });
  }
}
