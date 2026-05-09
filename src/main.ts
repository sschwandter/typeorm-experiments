import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { WinstonModule } from 'nest-winston';
import { winstonLogger } from './logging/winston.config';

async function bootstrap() {
  const logger = WinstonModule.createLogger({
    instance: winstonLogger,
  });
  const context = 'Bootstrap';
  const port = process.env.PORT ?? 3000;

  logger.log('Starting application', context);

  const app = await NestFactory.create(AppModule, {
    logger,
  });

  app.useLogger(logger);

  await app.listen(port);

  logger.log(`Application listening on port ${port}`, context);
}

bootstrap().catch((error: unknown) => {
  const logger = WinstonModule.createLogger({
    instance: winstonLogger,
  });
  const message =
    error instanceof Error ? error.message : 'Unknown bootstrap error';
  const trace = error instanceof Error ? error.stack : undefined;

  logger.error(message, trace, 'Bootstrap');
  process.exit(1);
});
