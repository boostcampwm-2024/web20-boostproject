import {
  ConnectedSocket,
  MessageBody,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UseFilters, UseGuards } from '@nestjs/common';
import { WebSocketExceptionFilter } from 'src/common/filter/webSocketExceptionFilter';
import { ChatService } from './chat.service';
import { chatDto } from './dto/chat.dto';
import { JWTAuthGuard } from 'src/auth/jwt-auth.guard';

@WebSocketGateway({ cors: { origin: '*', methods: ['GET', 'POST'] } })
@UseFilters(WebSocketExceptionFilter)
export class ChatGateway implements OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private readonly chatService: ChatService) {}

  //룸생성
  @UseGuards(JWTAuthGuard)
  @SubscribeMessage('createRoom')
  async handleCreateRoom(@MessageBody('roomId') roomId: string, @ConnectedSocket() client: Socket) {
    const result = await this.chatService.createRoom(roomId, client);

    return {
      roomId: result,
    };
  }
  //룸입장
  @UseGuards(JWTAuthGuard)
  @SubscribeMessage('joinRoom')
  async handleJoinRoom(@MessageBody('roomId') roomId: string, @ConnectedSocket() client: Socket) {
    await this.chatService.joinRoom(roomId, client);
  }
  //룸나가기
  @SubscribeMessage('leaveRoom')
  async handleLeaveRoom(@MessageBody('roomId') roomId: string, @ConnectedSocket() client: Socket) {
    this.chatService.leaveRoom(roomId, client);
  }
  //룸삭제
  @UseGuards(JWTAuthGuard)
  @SubscribeMessage('deleteRoom')
  async handleDeleteRoom(@MessageBody('roomId') roomId: string, @ConnectedSocket() client: Socket) {
    this.chatService.deleteRoom(roomId, client);
  }
  //채팅
  @UseGuards(JWTAuthGuard)
  @SubscribeMessage('chat')
  async handleChat(@MessageBody() params: chatDto, @ConnectedSocket() client: Socket) {
    this.chatService.broadcast(params, client);
  }

  handleDisconnect(client: Socket) {
    this.chatService.disconnect(client);
  }
}
