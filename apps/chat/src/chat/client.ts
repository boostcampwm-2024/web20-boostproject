import { Socket } from 'socket.io';

export class Client {
  private camperId: string;
  private name: string;
  private socket: Socket;

  constructor(camperId: string, name: string, socket: Socket) {
    this.camperId = camperId;
    this.name = name;
    this.socket = socket;
  }

  getCamperId() {
    return this.camperId;
  }

  getName() {
    return this.name;
  }

  getSocket() {
    return this.socket;
  }

  sendMessage(message: string) {
    this.socket.emit('chat', {
      camperId: this.camperId,
      name: this.name,
      message,
    });
  }
}
