import { ConsoleLogger } from '@nestjs/common';

export class DataLogger extends ConsoleLogger {
  log(message: any, context?: string) {
    super.log(message, context);
  }

  warn(message: any, context?: string) {
    super.warn(message, context);
  }

  verbose(message: any, context?: string) {
    super.verbose(message, context);
  }
}
