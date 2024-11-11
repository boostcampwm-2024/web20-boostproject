import { HttpException } from '@nestjs/common';
import { ErrorStatus } from './errorStatus';

export class CustomException extends HttpException {
  constructor(errorStatus: ErrorStatus) {
    super(
      {
        status: errorStatus.status,
        message: errorStatus.message,
      },
      errorStatus.code,
    );
  }
}
