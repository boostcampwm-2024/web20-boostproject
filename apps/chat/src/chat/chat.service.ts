import { Injectable, Logger } from '@nestjs/common';
import { Socket } from 'socket.io';
import { CustomWsException } from 'src/common/responses/exceptions/custom-ws.exception';
import { ErrorStatus } from 'src/common/responses/exceptions/errorStatus';
import { createRoomDto } from './dto/creat-room.dto';
import { joinRoomDto } from './dto/join-room.dto';
import { Client } from './client';
import { chatDto } from './dto/chat.dto';

interface IRoom {
  ownerId: string;
  clients: Map<string, Client>;
}

@Injectable()
export class ChatService {
  private rooms = new Map<string, IRoom>();
  private ownerToRoom = new Map<string, string>();
  private clientToRoom = new Map<string, string>();
  private readonly logger = new Logger(ChatService.name);

  createRoom(params: createRoomDto, client: Socket) {
    const { name, camperId, roomId } = params;
    const newClient = new Client(camperId, name, client);

    const room = {
      ownerId: client.id,
      clients: new Map(),
    };

    room.clients.set(client.id, newClient);
    this.ownerToRoom.set(client.id, roomId);
    this.rooms.set(roomId, room);

    this.logger.log(`Chat Room created: ${roomId}`);
    return roomId;
  }

  joinRoom(params: joinRoomDto, client: Socket) {
    const { name, camperId, roomId } = params;
    const room = this.rooms.get(roomId);
    if (!room) new CustomWsException(ErrorStatus.ROOM_NOT_FOUND);

    const newClient = new Client(camperId, name, client);

    room.clients.set(client.id, newClient);
    this.clientToRoom.set(client.id, roomId);
    this.logger.log(`Client Join Room: ${roomId}`);
  }

  leaveRoom(roomId: string, client: Socket) {
    const room = this.rooms.get(roomId);

    if (!room) new CustomWsException(ErrorStatus.ROOM_NOT_FOUND);

    room.clients.delete(client.id);

    this.logger.log(`Client Leave Room: ${roomId}`);
  }

  deleteRoom(roomId: string, client: Socket) {
    const room = this.rooms.get(roomId);

    if (!room) new CustomWsException(ErrorStatus.ROOM_NOT_FOUND);
    if (room.ownerId !== client.id) new CustomWsException(ErrorStatus.NO_HAVE_AUTHORITY_IN_ROOM);

    this.rooms.delete(roomId);
    this.logger.log(`Delete Chat Room: ${roomId}`);
  }

  broadcast(params: chatDto, client: Socket) {
    const { roomId, message } = params;
    const room = this.rooms.get(roomId);

    if (!room) new CustomWsException(ErrorStatus.ROOM_NOT_FOUND);

    const sendClient = room.clients.get(client.id);

    room.clients.forEach(anyClient => {
      anyClient.sendMessage(sendClient.getName(), sendClient.getName(), message);
    });

    this.logger.log(`BroadCast to Clients: room#${roomId} message#${message}}`);
  }

  disconnect(client: Socket) {
    if (this.ownerToRoom.has(client.id)) {
      //방삭제
      const roomId = this.ownerToRoom.get(client.id);
      this.deleteRoom(roomId, client);
    }
    if (this.clientToRoom.has(client.id)) {
      //방 떠나기
      const roomId = this.clientToRoom.get(client.id);
      this.leaveRoom(roomId, client);
    }
  }
}
