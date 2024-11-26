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

  sendMessage(camperId: string, name: string, message: string) {
    this.socket.emit('chat', {
      camperId,
      name,
      message,
    });
  }

  alertChatClosed() {
    this.socket.emit('chatClosed');
  }
}
