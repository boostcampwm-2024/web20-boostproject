import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import { createFfmpegProcess } from './ffmpeg';
import express from 'express';
import { getPort, releasePort } from './port';

dotenv.config();
const app = express();
app.use(express.json());

const dirPath = path.join(__dirname, '../thumbnail');
console.log(dirPath);

if (!fs.existsSync(dirPath)) {
  fs.mkdirSync(dirPath, { recursive: true });
}

app.post('/send', (req, res) => {
  const { port, roomId } = req.body;
  createFfmpegProcess(port, roomId);
  res.send({ success: true });
});

app.get('/availablePort', (req, res) => {
  res.send({ port: getPort() });
});

app.get('/images/:roomId', (req, res) => {
  const { roomId } = req.params;
  const thumbnailPath = path.join(__dirname, '../thumbnail', `${roomId}.jpg`);
  fs.access(thumbnailPath, fs.constants.F_OK, err => {
    if (err) {
      console.error(`Thumbnail not found for roomId: ${roomId}`);
      return res.status(404).send('Thumbnail not found');
    }
    res.sendFile(thumbnailPath);
  });
});

app.post('/close', (req, res) => {
  const { port } = req.body;
  releasePort(port);
  res.send({ success: true });
});

app.listen(3003);
