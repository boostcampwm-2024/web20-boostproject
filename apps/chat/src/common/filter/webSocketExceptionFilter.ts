import { Catch, ArgumentsHost } from '@nestjs/common';
import { BaseWsExceptionFilter, WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';

@Catch(WsException)
export class WebSocketExceptionFilter extends BaseWsExceptionFilter {
  catch(exception: WsException, host: ArgumentsHost) {
    const client = host.switchToWs().getClient<Socket>();
    const error = exception.getError();
    const details = {
      id: client.id,
      timestamp: new Date().toISOString(),
      error: typeof error === 'string' ? { message: error } : error,
    };

    client.emit('error', {
      event: 'error',
      data: details,
    });
  }
}
