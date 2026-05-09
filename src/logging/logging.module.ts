import { Global, Logger, Module, Scope } from '@nestjs/common';
import { INQUIRER } from '@nestjs/core';

@Global()
@Module({
  providers: [
    {
      provide: Logger,
      scope: Scope.TRANSIENT,
      inject: [INQUIRER],
      useFactory: (parentClass: object) => {
        return new Logger(parentClass?.constructor?.name ?? 'UnknownContext');
      },
    },
  ],
  exports: [Logger],
})
export class LoggingModule {}
