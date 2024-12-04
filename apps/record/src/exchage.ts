import { spawn } from 'child_process';
import fs from 'fs';
import { uploadObjectFromDir } from './object';
import path from 'path';

export const convertWebMToHLS = async (inputPath: string, recordsDirPath: string, roomId: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const outputDir = `${recordsDirPath}/${roomId}`;
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    console.log('Converting WebM to HLS...');
    const args = [
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

    console.log('Starting FFmpeg with arguments:', args.join(' '));

    const ffmpeg = spawn('ffmpeg', args);

    ffmpeg.stdout.on('data', data => console.log(`[FFmpeg stdout]: ${data}`));
    ffmpeg.stderr.on('data', data => console.error(`[FFmpeg stderr]: ${data}`));

    ffmpeg.on('close', async code => {
      if (code === 0) {
        try {
          await deleteFile(inputPath);
          await uploadRecord(roomId, recordsDirPath);
          console.log('HLS conversion completed successfully.');
          resolve(); // 성공적으로 종료
        } catch (error) {
          reject(error); // 에러 발생 시 reject 호출
        }
      } else {
        const error = new Error(`FFmpeg exited with code ${code}`);
        console.error(error.message);
        reject(error); // FFmpeg 에러 발생 시 reject 호출
      }
    });

    ffmpeg.on('error', error => {
      console.error('Failed to start FFmpeg process:', error);
      reject(error); // 프로세스 시작 실패 시 reject 호출
    });
  });
};

const uploadRecord = async (roomId: string, recordsDirPath: string) => {
  await uploadObjectFromDir(roomId, recordsDirPath);
  const roomDirPath = `${recordsDirPath}/${roomId}`;
  if (fs.existsSync(roomDirPath)) {
    await deleteAllFiles(roomDirPath);
    console.log(`All files in ${roomDirPath} deleted successfully.`);
  }
};

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

async function deleteFile(filePath: string): Promise<void> {
  try {
    await fs.promises.unlink(filePath);
    console.log(`File deleted successfully: ${filePath}`);
  } catch (error) {
    console.error(`Error deleting file: ${filePath}`, error);
  }
}
