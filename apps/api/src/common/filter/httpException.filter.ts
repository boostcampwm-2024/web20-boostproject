import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Response } from 'express';
import { CustomException } from '../exceptions/custom.exception';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    if (exception instanceof CustomException) {
      const errorResponse = exception.getResponse() as any;
      response
        .status(status)
        .json({
          status: errorResponse.status,
          success: false,
          message: errorResponse.message,
        });
    } else {
      const errorResponse = exception.getResponse() as any;
      response
        .status(status)
        .json({
          status: status,
          success: false,
          message: typeof errorResponse === 'string' 
            ? errorResponse 
            : errorResponse.message,
        });
    }
  }
}