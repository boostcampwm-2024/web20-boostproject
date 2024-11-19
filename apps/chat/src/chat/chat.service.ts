import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
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
  rooms = new Map<string, IRoom>();

  createRoom(params: createRoomDto, client: Socket) {
    const { name, camperId } = params;

    const roomId = randomUUID();
    const newClient = new Client(name, camperId, client);

    const room = {
      ownerId: client.id,
      clients: [newClient],
    };
    this.rooms.set(roomId, room);

    return roomId;
  }

  joinRoom(params: joinRoomDto, client: Socket) {
    const { name, camperId, roomId } = params;
    const room = this.rooms.get(roomId);

    if (!room) new CustomWsException(ErrorStatus.ROOM_NOT_FOUND);

    const newClient = new Client(name, camperId, client);

    room.clients.push(newClient);
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
  }

  deleteRoom(roomId: string, client: Socket) {
    const room = this.rooms.get(roomId);

    if (!room) new CustomWsException(ErrorStatus.ROOM_NOT_FOUND);
    if (room.ownerId !== client.id) new CustomWsException(ErrorStatus.NO_HAVE_AUTHORITY_IN_ROOM);

    this.rooms.delete(roomId);
  }

  broadcast(params: chatDto) {
    const { roomId, message } = params;
    const room = this.rooms.get(roomId);

    if (!room) new CustomWsException(ErrorStatus.ROOM_NOT_FOUND);

    room.clients.forEach(client => {
      client.sendMessage(message);
    });
  }
}
