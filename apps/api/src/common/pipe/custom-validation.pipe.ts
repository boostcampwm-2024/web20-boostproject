import { ValidationPipe, ValidationError } from '@nestjs/common';
import { ErrorStatus } from '../responses/exceptions/errorStatus';
import { CustomException } from '../responses/exceptions/custom.exception';

export class CustomValidationPipe extends ValidationPipe {
  constructor() {
    super({
      exceptionFactory: (errors: ValidationError[]) => {
        const messages = this.flattenValidationErrors(errors);

        const formattedMessage = messages.join(' / ');

        throw new CustomException({
          status: ErrorStatus.BAD_REQUEST.status,
          code: ErrorStatus.BAD_REQUEST.code,
          message: formattedMessage,
        });
      },
    });
  }
}
