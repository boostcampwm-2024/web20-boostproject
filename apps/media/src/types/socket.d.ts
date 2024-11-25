import 'socket.io';
import { User } from './user';

declare module 'socket.io' {
  interface Socket {
    user: User;
  }
}
