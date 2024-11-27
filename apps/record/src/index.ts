import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import express from 'express';
import { getPort, releasePort } from './port';
import cors from 'cors';
import { createFfmpegProcess } from './ffmpeg';

dotenv.config();

const app = express();
const assetsDirPath = path.join(__dirname, '../assets');
const thumbnailsDirPath = path.join(__dirname, '../assets/thumbnails');
const recordsDirPath = path.join(__dirname, '../assets/records');

app.use(express.json());
app.use(cors());
app.use('/statics', express.static(assetsDirPath));

if (!fs.existsSync(assetsDirPath)) {
  fs.mkdirSync(assetsDirPath, { recursive: true });
}

if (!fs.existsSync(thumbnailsDirPath)) {
  fs.mkdirSync(thumbnailsDirPath, { recursive: true });
}

if (!fs.existsSync(recordsDirPath)) {
  fs.mkdirSync(recordsDirPath, { recursive: true });
}

app.post('/send', (req, res) => {
  const { videoPort, roomId, type, audioPort } = req.body;
  createFfmpegProcess(videoPort, assetsDirPath, roomId, type, audioPort);
  res.send({ success: true });
});

app.get('/availablePort', (req, res) => {
  res.send({ port: getPort() });
});

app.post('/close', (req, res) => {
  const { port, roomId } = req.body;
  releasePort(port);
  const thumbnailPath = path.join(thumbnailsDirPath, `${roomId}.jpg`);
  fs.unlink(thumbnailPath, err => {
    if (err) {
      console.error(`Failed to delete thumbnail for roomId: ${roomId}`);
    }
  });
  res.send({ success: true });
});

app.listen(3003);
