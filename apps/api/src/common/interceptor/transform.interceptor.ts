import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SuccessResponseFormat } from '../interfaces/response.interface';

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, SuccessResponseFormat<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<SuccessResponseFormat<T>> {
    return next.handle().pipe(
      map(data => ({
        status: '200',
        success: true,
        message: 'OK.',
        data
      }))
    );
  }
}