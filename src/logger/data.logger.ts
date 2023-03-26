import { ConsoleLogger, Injectable, Scope } from '@nestjs/common';

@Injectable({ scope: Scope.TRANSIENT })
export class DataLogger extends ConsoleLogger {
  dbLog() {
    this.log('Please feed the cat!');
  }
}
