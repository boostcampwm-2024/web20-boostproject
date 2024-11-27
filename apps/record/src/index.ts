import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import express from 'express';
import { getPort, releasePort } from './port';
import cors from 'cors';
import { createFfmpegProcess } from './ffmpeg';
import { uploadObjectFromDir } from './object';

dotenv.config();

const app = express();
const dirPath = path.join(__dirname, '../assets');

app.use(express.json());
app.use(cors());
app.use('/statics', express.static(dirPath));

if (!fs.existsSync(dirPath)) {
  fs.mkdirSync(dirPath, { recursive: true });
}

app.post('/send', (req, res) => {
  const { port, roomId, type } = req.body;
  createFfmpegProcess(port, dirPath, roomId, type);
  res.send({ success: true });
});

app.get('/availablePort', (req, res) => {
  res.send({ port: getPort() });
});

app.get('/images/:roomId', (req, res) => {
  const { roomId } = req.params;
  const thumbnailPath = path.join(dirPath, `thumbnails/${roomId}.jpg`);
  fs.access(thumbnailPath, fs.constants.F_OK, err => {
    if (err) {
      console.error(`Thumbnail not found for roomId: ${roomId}`);
      return res.status(404).send('Thumbnail not found');
    }
    res.sendFile(thumbnailPath);
  });
});

app.post('/close', (req, res) => {
  const { port, roomId } = req.body;
  releasePort(port);
  const thumbnailPath = path.join(dirPath, `thumbnails/${roomId}.jpg`);
  fs.unlink(thumbnailPath, err => {
    if (err) {
      console.error(`Failed to delete thumbnail for roomId: ${roomId}`);
    }
  });
  res.send({ success: true });
});
app.post('/record/stop/:roomId', async (req, res) => {
  const { roomId } = req.params;
  const roomDirPath = path.join(dirPath, 'records', roomId);
  await uploadObjectFromDir(roomId, dirPath);
  if (fs.existsSync(roomDirPath)) {
    await deleteAllFiles(roomDirPath);
    await fs.promises.rmdir(roomDirPath); // 최상위 디렉토리 삭제
    console.log(`All files in ${roomDirPath} deleted successfully.`);
  }
  res.send({ success: true });
});

app.listen(3003);

async function deleteAllFiles(directoryPath: string): Promise<void> {
  try {
    const files = await fs.promises.readdir(directoryPath, { withFileTypes: true });
    for (const file of files) {
      const fullPath = path.join(directoryPath, file.name);
      if (file.isDirectory()) {
        await deleteAllFiles(fullPath); // 재귀적으로 디렉토리 삭제
        await fs.promises.rmdir(fullPath); // 빈 디렉토리 삭제
      } else {
        await fs.promises.unlink(fullPath); // 파일 삭제
      }
    }
  } catch (error) {
    console.error(`Error deleting files in directory: ${directoryPath}`, error);
    throw error;
  }
}
