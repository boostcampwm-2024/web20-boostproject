import { Injectable } from '@nestjs/common';

interface IClientTransport {
  transportId: string;
  roomId: string;
}

@Injectable()
export class ClientService {
  private clientRoom = new Map<string, string>();
  private clientTransport = new Map<string, IClientTransport>();

  addClientToRoom(clientId: string, roomId: string) {
    this.clientRoom.set(clientId, roomId);
  }
  addClientTransport(clientId: string, transportId: string, roomId: string) {
    this.clientTransport.set(clientId, { transportId, roomId });
  }

  hasRoom(clientId: string) {
    return this.clientRoom.has(clientId);
  }

  hasTransport(clientId: string) {
    return this.clientTransport.has(clientId);
  }

  getClientRoom(clientId: string) {
    return this.clientRoom.get(clientId);
  }

  getClientTransport(clientId: string) {
    return this.clientTransport.get(clientId);
  }

  removeClient(clientId: string) {
    this.clientRoom.delete(clientId);
    this.clientTransport.delete(clientId);
  }
}
