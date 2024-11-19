import { WsException } from '@nestjs/websockets';
import { ErrorStatus } from './errorStatus';

export class CustomWsException extends WsException {
  constructor(errorStatus: ErrorStatus) {
    super({
      status: errorStatus.status,
      code: errorStatus.code,
      message: errorStatus.message,
    });
  }
}
