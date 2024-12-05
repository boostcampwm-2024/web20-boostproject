import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { addVideoToQueue } from './queue';

export const createFfmpegProcess = (
  videoPort: number,
  assetsDirPath: string,
  roomId: string,
  type: 'thumbnail' | 'record',
  audioPort?: number,
) => {
  if (type === 'record') {
    fs.mkdirSync(`${assetsDirPath}/videos/${roomId}`, { recursive: true });
  }
  const randomStr = crypto.randomUUID();
  const sdpString = audioPort ? createRecordSdpText(videoPort, audioPort) : createThumbnailSdpText(videoPort);
  const args =
    type === 'thumbnail' ? thumbnailArgs(assetsDirPath, roomId) : recordArgs(assetsDirPath, roomId, randomStr);
  const ffmpegProcess = spawn('ffmpeg', args);

  ffmpegProcess.stdin.write(sdpString);
  ffmpegProcess.stdin.end();

  handleFfmpegProcess(ffmpegProcess, type, roomId, assetsDirPath, randomStr);
};

const handleFfmpegProcess = (
  process: ReturnType<typeof spawn>,
  type: string,
  roomId: string,
  assetsDirPath: string,
  uuid: string,
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
      await stopRecord(roomId, uuid);
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
    'fps=1/15', // 10초마다 한 프레임을 캡처
    '-f',
    'image2', // 이미지 출력 포맷 명시
    '-update',
    '1',
    '-y', // 강제 덮어쓰기
    `${dirPath}/thumbnails/${roomId}.jpg`, // 덮어쓸 출력 파일 이름
  ];
  return commandArgs;
};

const recordArgs = (dirPath: string, roomId: string, randomStr: string) => {
  const commandArgs = [
    '-loglevel',
    'info', // 로그 활성화
    '-protocol_whitelist',
    'pipe,udp,rtp', // 허용할 프로토콜 정의
    '-f',
    'sdp', // 입력 포맷
    '-i',
    'pipe:0', // SDP를 파이프로 전달
    '-c',
    'copy', // 코덱 재인코딩 없이 원본 저장
    '-y', // 파일 덮어쓰기 허용
    `${dirPath}/videos/${roomId}/${randomStr}.webm`,
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

async function stopRecord(roomId: string, uuid: string) {
  const video = {
    roomId,
    randomStr: uuid,
    title: 'title',
  };

  addVideoToQueue(video);
}
