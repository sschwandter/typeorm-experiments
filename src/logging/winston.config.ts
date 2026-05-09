import { mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { utilities, WinstonModuleOptions } from 'nest-winston';
import winston from 'winston';
import { requestContext } from './request-context';

const logsDirectory = join(process.cwd(), 'logs');

function ensureLogsDirectory() {
  mkdirSync(logsDirectory, { recursive: true });
}

const requestContextFormat = winston.format((info) => {
  const store = requestContext.getStore();

  if (store?.requestId) {
    info.requestId = store.requestId;
  }

  return info;
});

const commonFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  requestContextFormat(),
);

const jsonFormat = winston.format.combine(
  commonFormat,
  winston.format.metadata({
    fillExcept: [
      'timestamp',
      'level',
      'message',
      'context',
      'requestId',
      'stack',
    ],
  }),
  winston.format.json(),
);

export function createWinstonOptions(): WinstonModuleOptions {
  ensureLogsDirectory();

  return {
    level: process.env.LOG_LEVEL ?? 'info',
    transports: [
      new winston.transports.Console({
        format: winston.format.combine(
          commonFormat,
          utilities.format.nestLike('typeorm-experiments', {
            colors: true,
            prettyPrint: true,
          }),
        ),
      }),
      new winston.transports.File({
        filename: join(logsDirectory, 'application.log'),
        format: jsonFormat,
      }),
      new winston.transports.File({
        filename: join(logsDirectory, 'error.log'),
        level: 'error',
        format: jsonFormat,
      }),
    ],
  };
}

export const winstonLogger = winston.createLogger(createWinstonOptions());
