import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Socket } from 'socket.io';
import { CustomWsException } from 'src/common/responses/exceptions/custom-ws.exception';
import { ErrorStatus } from 'src/common/responses/exceptions/errorStatus';

@Injectable()
export class JWTAuthGuard extends AuthGuard('jwt') {
  getRequest(context: ExecutionContext) {
    const client = context.switchToWs().getClient<Socket>();

    return {
      headers: {
        authorization: client.handshake.auth.accessToken,
      },
    };
  }

  handleRequest(err, user, info, context) {
    if (err || !user) {
      throw new CustomWsException(ErrorStatus.UNAUTHORIZED);
    }

    const client = context.switchToWs().getClient();
    client.user = user;

    return user;
  }
}
