import { HttpException } from '@nestjs/common';
import { ErrorStatus } from './errorStatus';

export class CustomException extends HttpException {
  constructor(errorStatus: ErrorStatus) {
    super(
      {
        status: errorStatus.status,
        message: errorStatus.message,
      },
      500 // 상속용, 실제 사용 x, errorTypes에서 정의한 statusCode 사용예정
    );
  }
}
