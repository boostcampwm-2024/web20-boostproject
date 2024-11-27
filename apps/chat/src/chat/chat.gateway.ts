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
import { createRoomDto } from './dto/creat-room.dto';
import { joinRoomDto } from './dto/join-room.dto';
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
  async handleCreateRoom(@MessageBody() params: createRoomDto, @ConnectedSocket() client: Socket) {
    const roomId = this.chatService.createRoom(params, client);

    return {
      roomId,
    };
  }
  //룸입장
  @SubscribeMessage('joinRoom')
  async handleJoinRoom(@MessageBody() params: joinRoomDto, @ConnectedSocket() client: Socket) {
    this.chatService.joinRoom(params, client);
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
