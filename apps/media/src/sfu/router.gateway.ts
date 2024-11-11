import { SfuGateway } from './sfu.gateway';
import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway()
export class RouterGateway {
  @WebSocketServer()
  server: Server;
  constructor(private readonly sfuGateway: SfuGateway) {}
}
