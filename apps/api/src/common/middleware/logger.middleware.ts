import { Injectable, NestMiddleware, Inject } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { Logger } from 'winston';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(@Inject('winston') private readonly logger: Logger) {}

  use(req: Request, res: Response, next: NextFunction) {
    const traceId = uuidv4().split('-')[0];
    const { method, originalUrl } = req;
    const start = Date.now();
    this.logger.info(`[${traceId}] Request: ${method} ${originalUrl}`);

    const originalSend = res.send;

    res.send = (body: any): Response => {
      const delay = Date.now() - start;
      const { statusCode } = res;
      const responseBody = typeof body === 'object' ? JSON.stringify(body) : body;

      const logMessage = `[${traceId}] Response: ${method} ${originalUrl} ${statusCode} - ${delay}ms - Response Body: ${responseBody}`;

      if (statusCode >= 500) {
        this.logger.error(logMessage);
      } else if (statusCode >= 400) {
        this.logger.warn(logMessage);
      } else {
        this.logger.info(logMessage);
      }
      return originalSend.call(res, body);
    };

    next();
  }
}
