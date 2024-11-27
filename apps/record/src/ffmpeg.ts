import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

export const createFfmpegProcess = (
  videoPort: number,
  dirPath: string,
  roomId: string,
  type: 'thumbnail' | 'record',
  audioPort?: number,
) => {
  if (type === 'record') {
    const recordsDirPath = path.join(__dirname, '../assets/records');
    fs.mkdirSync(`${recordsDirPath}/${roomId}`, { recursive: true });
  }
  const sdpString = audioPort ? createRecordSdpText(videoPort, audioPort) : createThumbnailSdpText(videoPort);
  const args = type === 'thumbnail' ? thumbnailArgs(dirPath, roomId) : recordArgs(dirPath, roomId);
  const ffmpegProcess = spawn('ffmpeg', args);

  ffmpegProcess.stdin.write(sdpString);
  ffmpegProcess.stdin.end();

  handleFfmpegProcess(ffmpegProcess, type);
};

const handleFfmpegProcess = (process: ReturnType<typeof spawn>, type: string) => {
  if (process.stderr) {
    process.stderr.setEncoding('utf-8');
    process.stderr.on('data', data => console.log(`[FFmpeg ${type}] stderr:`, data));
  }
  if (process.stdout) {
    process.stdout.setEncoding('utf-8');
    process.stdout.on('data', data => console.log(`[FFmpeg ${type}] stdout:`, data));
  }
  process.on('error', error => console.error(`[FFmpeg ${type}] error:`, error));
  process.on('close', code => console.log(`[FFmpeg ${type}] process exited with code: ${code}`));
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
a=rtcp-mux
m=audio ${audioPort} RTP/AVP 111
a=rtpmap:111 OPUS/48000/2
a=sendonly
a=rtcp-mux
`;
};

const thumbnailArgs = (dirPath: string, roomId: string) => {
  const commandArgs = [
    '-loglevel',
    'info', // 로그 활성화
    '-protocol_whitelist',
    'pipe,udp,rtp', // 허용할 프로토콜 정의
    '-f',
    'sdp', // 입력 포맷
    '-i',
    'pipe:0', // SDP를 파이프로 전달
    '-vf',
    'fps=1/10,scale=1280:720', // 10초마다 한 프레임을 캡처하고 해상도 조정
    '-update',
    '1', // 같은 파일에 덮어쓰기 활성화
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
    // HLS 스트리밍 저장
    '-c:v',
    'libx264', // 비디오 코덱
    '-preset',
    'veryfast', // 빠른 인코딩
    '-profile:v',
    'high', // H.264 High 프로필
    '-level:v',
    '4.1', // H.264 레벨 설정 (4.1)
    '-crf',
    '23', // 비디오 품질 설정
    '-vf',
    'mpdecimate', //중복 프레임 제거
    '-c:a',
    'libopus', // 오디오 코덱
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
    '6', // 각 세그먼트 길이 (초)
    '-hls_list_size',
    '0', // 유지할 세그먼트 개수
    '-hls_segment_filename',
    `${dirPath}/records/${roomId}/segment_%03d.ts`, // HLS 세그먼트 파일 이름
    `${dirPath}/records/${roomId}/video.m3u8`, // HLS 플레이리스트 파일 이름
  ];
  return commandArgs;
};
