import { spawn } from 'child_process';
import fs from 'fs';
import { uploadObjectFromDir } from './object';
import path from 'path';

export const convertWebMToHLS = (inputPath: string, recordsDirPath: string, roomId: string) => {
  const outputDir = `${recordsDirPath}/${roomId}`;

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  console.log('Converting WebM to HLS...');

  const args = exchangeArgs(inputPath, outputDir);
  const ffmpegProcess = spawn('ffmpeg', args);

  handleFfmpegProcess(ffmpegProcess, inputPath, recordsDirPath, roomId);
};

const handleFfmpegProcess = (
  process: ReturnType<typeof spawn>,
  inputPath: string,
  recordsDirPath: string,
  roomId: string,
) => {
  if (process.stderr) {
    process.stderr.on('data', data => console.error(`[FFmpeg stderr]: ${data}`));
  }
  if (process.stdout) {
    process.stdout.on('data', data => console.log(`[FFmpeg stdout]: ${data}`));
  }
  process.on('error', error => {
    console.error('Failed to start FFmpeg process:', error);
  });
  process.on('close', async code => {
    if (code === 0) {
      await deleteFile(inputPath);
      await uploadRecord(roomId, recordsDirPath);
      console.log('HLS conversion completed successfully.');
    }
  });
};

const exchangeArgs = (inputPath: string, outputDir: string) => {
  const commandArgs = [
    '-i',
    inputPath, // Input WebM file
    '-vf',
    'scale=trunc(iw/2)*2:trunc(ih/2)*2', // 가로, 세로 해상도를 2의 배수로 조정
    '-codec:v',
    'libx264', // Convert video to H.264
    '-preset',
    'veryfast', // Faster encoding
    '-crf',
    '25', // Quality level (lower is better)
    '-codec:a',
    'aac', // Convert audio to AAC
    '-b:a',
    '128k', // Audio bitrate
    '-ac',
    '1', // Stereo audio
    '-hls_time',
    '10', // Duration of each HLS segment (in seconds)
    '-hls_list_size',
    '0', // Keep all HLS segments in the playlist
    '-hls_segment_filename',
    `${outputDir}/segment_%03d.ts`, // Segment files
    `${outputDir}/video.m3u8`, // HLS playlist file
  ];
  return commandArgs;
};

const uploadRecord = async (roomId: string, recordsDirPath: string) => {
  await uploadObjectFromDir(roomId, recordsDirPath);
  const roomDirPath = `${recordsDirPath}/${roomId}`;
  if (fs.existsSync(roomDirPath)) {
    await deleteAllFiles(roomDirPath);
    console.log(`All files in ${roomDirPath} deleted successfully.`);
  }
};

async function deleteAllFiles(directoryPath: string) {
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

async function deleteFile(filePath: string) {
  try {
    await fs.promises.unlink(filePath);
    console.log(`File deleted successfully: ${filePath}`);
  } catch (error) {
    console.error(`Error deleting file: ${filePath}`, error);
  }
}
