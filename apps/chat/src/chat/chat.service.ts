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
  clients: Client[];
}

@Injectable()
export class ChatService {
  private rooms = new Map<string, IRoom>();
  private readonly logger = new Logger(ChatService.name);

  createRoom(params: createRoomDto, client: Socket) {
    const { name, camperId, roomId } = params;
    const newClient = new Client(name, camperId, client);

    const room = {
      ownerId: client.id,
      clients: [newClient],
    };

    this.rooms.set(roomId, room);
    this.logger.log(`Chat Room created: ${roomId}`);
    return roomId;
  }

  joinRoom(params: joinRoomDto, client: Socket) {
    const { name, camperId, roomId } = params;
    const room = this.rooms.get(roomId);
    if (!room) new CustomWsException(ErrorStatus.ROOM_NOT_FOUND);

    const newClient = new Client(name, camperId, client);

    room.clients.push(newClient);
    this.logger.log(`Client Join Room: ${room}`);
  }

  leaveRoom(roomId: string, client: Socket) {
    const room = this.rooms.get(roomId);

    if (!room) new CustomWsException(ErrorStatus.ROOM_NOT_FOUND);

    const updatedClients = room.clients.filter(anyClient => anyClient.getSocket() !== client);

    const updatedRoom = {
      ...room,
      clients: updatedClients,
    };

    this.rooms.set(roomId, updatedRoom);
    this.logger.log(`Client Leave Room: ${room}`);
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

    const sendClient = room.clients.find(anyClient => anyClient.getSocket() === client);

    room.clients.forEach(anyClient => {
      anyClient.sendMessage(sendClient.getName(), sendClient.getName(), message);
    });

    this.logger.log(`BroadCast to Clients: room#${roomId} message#${message}}`);
  }
}
