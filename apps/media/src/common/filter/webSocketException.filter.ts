import { Catch, ArgumentsHost, Logger } from '@nestjs/common';
import { BaseWsExceptionFilter, WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';

@Catch(WsException)
export class WebSocketExceptionFilter extends BaseWsExceptionFilter {
  private readonly logger = new Logger(WebSocketExceptionFilter.name);
  catch(exception: WsException, host: ArgumentsHost) {
    this.logger.error(exception);
    const client = host.switchToWs().getClient<Socket>();
    const event = host.switchToWs().getPattern();

    const error = exception.getError() as {
      status: number;
      code: string;
      message: string;
    };

    const wsResponse = {
      event,
      data: {
        status: error.status || 'error',
        message: error.message || 'Internal server error',
        code: error.code || 500,
      },
    };
    client.emit('exception', wsResponse);
  }
}
