import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { uploadObjectFromDir } from './object';

export const createFfmpegProcess = (
  videoPort: number,
  assetsDirPath: string,
  roomId: string,
  type: 'thumbnail' | 'record',
  audioPort?: number,
) => {
  if (type === 'record') {
    fs.mkdirSync(`${assetsDirPath}/records/${roomId}`, { recursive: true });
  }
  const sdpString = audioPort ? createRecordSdpText(videoPort, audioPort) : createThumbnailSdpText(videoPort);
  const args = type === 'thumbnail' ? thumbnailArgs(assetsDirPath, roomId) : recordArgs(assetsDirPath, roomId);
  const ffmpegProcess = spawn('ffmpeg', args);

  ffmpegProcess.stdin.write(sdpString);
  ffmpegProcess.stdin.end();

  handleFfmpegProcess(ffmpegProcess, type, roomId, assetsDirPath);
};

const handleFfmpegProcess = (
  process: ReturnType<typeof spawn>,
  type: string,
  roomId: string,
  assetsDirPath: string,
) => {
  if (process.stderr) {
    process.stderr.setEncoding('utf-8');
    process.stderr.on('data', data => console.log(`[FFmpeg ${type}] stderr:`, data));
  }
  if (process.stdout) {
    process.stdout.setEncoding('utf-8');
    process.stdout.on('data', data => console.log(`[FFmpeg ${type}] stdout:`, data));
  }
  process.on('error', error => console.error(`[FFmpeg ${type}] error:`, error));
  process.on('close', async code => {
    if (type === 'record') {
      await stopRecord(assetsDirPath, roomId);
    } else {
      await stopMakeThumbnail(assetsDirPath, roomId);
    }
    console.log(`[FFmpeg ${type}] process exited with code: ${code}`);
  });
};

const createThumbnailSdpText = (videoPort: number) => {
  return `v=0
o=- 0 0 IN IP4 127.0.0.1
s=FFmpeg
c=IN IP4 127.0.0.1
t=0 0
m=video ${videoPort} RTP/AVP 101
a=rtpmap:101 VP8/90000
a=sendonly
a=rtcp-mux
`;
};

const createRecordSdpText = (videoPort: number, audioPort: number) => {
  return `v=0
o=- 0 0 IN IP4 127.0.0.1
s=FFmpeg
c=IN IP4 127.0.0.1
t=0 0
m=video ${videoPort} RTP/AVP 101
a=rtpmap:101 VP8/90000
a=sendonly
m=audio ${audioPort} RTP/AVP 100
a=rtpmap:100 OPUS/48000/2
a=sendonly
`;
};

const thumbnailArgs = (dirPath: string, roomId: string) => {
  const commandArgs = [
    '-loglevel',
    'warning', // 로그 활성화
    '-protocol_whitelist',
    'pipe,udp,rtp', // 허용할 프로토콜 정의
    '-f',
    'sdp', // 입력 포맷
    '-i',
    'pipe:0', // SDP를 파이프로 전달
    '-vf',
    'fps=1/10,scale=1280:720', // 10초마다 한 프레임을 캡처하고 해상도 조정
    '-f',
    'image2', // 이미지 출력 포맷 명시
    '-update',
    '1',
    '-y', // 강제 덮어쓰기
    `${dirPath}/thumbnails/${roomId}.jpg`, // 덮어쓸 출력 파일 이름
  ];
  return commandArgs;
};

const recordArgs = (dirPath: string, roomId: string) => {
  const commandArgs = [
    '-loglevel',
    'info', // 로그 활성화
    '-protocol_whitelist',
    'pipe,udp,rtp', // 허용할 프로토콜 정의
    '-f',
    'sdp', // SDP 입력 포맷
    '-i',
    'pipe:0', // SDP를 파이프로 전달
    '-c:v',
    'libx264', // 비디오 코덱
    '-preset',
    'slow',
    '-profile:v',
    'high', // H.264 High 프로필
    '-level:v',
    '4.1', // H.264 레벨 설정 (4.1)
    '-crf',
    '1', // 비디오 품질 설정
    '-c:a',
    'libmp3lame', // 오디오 코덱
    '-b:a',
    '128k', // 오디오 비트레이트
    '-ar',
    '48000', // 오디오 샘플링 레이트
    '-af',
    'aresample=async=1', // 오디오 샘플 동기화
    '-ac',
    '2',
    '-f',
    'hls', // HLS 출력 포맷
    '-hls_time',
    '15', // 각 세그먼트 길이 (초)
    '-hls_list_size',
    '0', // 유지할 세그먼트 개수
    '-hls_segment_filename',
    `${dirPath}/records/${roomId}/segment_%03d.ts`, // HLS 세그먼트 파일 이름
    `${dirPath}/records/${roomId}/video.m3u8`, // HLS 플레이리스트 파일 이름
  ];
  return commandArgs;
};

async function stopMakeThumbnail(assetsDirPath: string, roomId: string) {
  const thumbnailPath = path.join(assetsDirPath, 'thumbnails', `${roomId}.jpg`);
  fs.unlink(thumbnailPath, err => {
    if (err) {
      console.error(`Failed to delete thumbnail for roomId: ${roomId}`);
    }
  });
}

async function stopRecord(assetsDirPath: string, roomId: string) {
  const roomDirPath = path.join(assetsDirPath, 'records', roomId);
  await uploadObjectFromDir(roomId, assetsDirPath);
  if (fs.existsSync(roomDirPath)) {
    await deleteAllFiles(roomDirPath);
    console.log(`All files in ${roomDirPath} deleted successfully.`);
  }
}

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
