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
const defaultThumbnailPath = path.join(__dirname, '../assets/default-thumbnail.jpg');
const videosDirPath = path.join(__dirname, '../assets/videos');

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

if (!fs.existsSync(videosDirPath)) {
  fs.mkdirSync(videosDirPath, { recursive: true });
}

app.post('/thumbnail', (req, res) => {
  const { roomId } = req.body;
  try {
    if (!fs.existsSync(defaultThumbnailPath)) {
      console.error('Default thumbnail not found');
      res.status(404).send({ error: 'Default thumbnail not found' });
    }
    const newThumbnailPath = path.join(thumbnailsDirPath, `${roomId}.jpg`);
    fs.copyFileSync(defaultThumbnailPath, newThumbnailPath);
    console.log('Default Thumbnail 생성됨:', newThumbnailPath);
    res.send({ success: true });
  } catch (error) {
    res.status(500).send({ success: false, error: 'Failed to create thumbnail' });
  }
});

app.post('/send', (req, res) => {
  const { videoPort, roomId, type, audioPort } = req.body;
  createFfmpegProcess(videoPort, assetsDirPath, roomId, type, audioPort);
  res.send({ success: true });
});

app.get('/availablePort', (req, res) => {
  res.send({ port: getPort() });
});

app.post('/close', (req, res) => {
  const { port } = req.body;
  releasePort(port);

  res.send({ success: true });
});

app.listen(3003);
