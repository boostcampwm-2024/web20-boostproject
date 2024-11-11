import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SuccessStatus } from '../responses/bases/successStatus';
import { SuccessResponse } from '../responses/bases/successResponse';

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map(data => {
        if (data instanceof SuccessStatus) {
          return new SuccessResponse(data).toResponse();
        }

        return new SuccessResponse(new SuccessStatus(true, '200', 'OK.', data)).toResponse();
      }),
    );
  }
}
