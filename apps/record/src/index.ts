import dotenv from 'dotenv';
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';

dotenv.config();

const PORT = process.env.PORT;
const app = express();
const server = http.createServer(app);
const io = new Server(server);

io.on('connect', client => {
  console.log(client);
});

server.listen(PORT, () => {
  console.log('Recording Server listening on port 3000');
});

export default app;
