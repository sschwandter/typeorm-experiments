import { Global, Logger, Module, Scope } from '@nestjs/common';
import { INQUIRER } from '@nestjs/core';

@Global()
@Module({
  providers: [
    {
      provide: Logger,
      // Use TRANSIENT scope so that a new Logger instance is created for every injecting class.
      // This allows each instance to have its own specific context.
      scope: Scope.TRANSIENT,
      // The INQUIRER token provides access to the class instance that is requesting the Logger.
      inject: [INQUIRER],
      useFactory: (parentClass: object) => {
        // Automatically set the Logger context to the name of the class where it's injected.
        return new Logger(parentClass?.constructor?.name ?? 'UnknownContext');
      },
    },
  ],
  exports: [Logger],
})
export class LoggingModule {}
