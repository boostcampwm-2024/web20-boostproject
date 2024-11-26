import { spawn } from 'child_process';
import fs from 'fs';

export const createFfmpegProcess = (port: number, dirPath: string, roomId: string) => {
  const sdpString = createSdpText(port);
  createDir(`${dirPath}/records/${roomId}`);
  const ffmpegProcess = spawn('ffmpeg', commandArgs(dirPath, roomId));
  ffmpegProcess.stdin.write(sdpString);
  ffmpegProcess.stdin.end();

  if (ffmpegProcess.stderr) {
    ffmpegProcess.stderr.setEncoding('utf-8');
    ffmpegProcess.stderr.on('data', data => console.log('ffmpeg::process::data [data:%o]', data));
  }
  if (ffmpegProcess.stdout) {
    ffmpegProcess.stdout.setEncoding('utf-8');
    ffmpegProcess.stdout.on('data', data => console.log('ffmpeg::stdout [data:%o]', data));
  }
  ffmpegProcess.on('error', error => console.error('ffmpeg::process::error [error:%o]', error));
  ffmpegProcess.on('close', code => {
    console.log(`FFmpeg process exited with code: ${code}`);
  });
};

const createSdpText = (port: number) => {
  return `v=0
o=- 0 0 IN IP4 127.0.0.1
s=FFmpeg
c=IN IP4 127.0.0.1
t=0 0
m=video ${port} RTP/AVP 101 
a=rtpmap:101 VP8/90000
a=sendonly
a=rtcp-mux
`;
};

// const commandArgs = (dirPath: string, roomId: string) => {
//   const commandArgs = [
//     '-loglevel',
//     'info', // 로그 활성화
//     '-protocol_whitelist',
//     'pipe,udp,rtp', // 허용할 프로토콜 정의
//     '-f',
//     'sdp', // 입력 포맷
//     '-i',
//     'pipe:0', // SDP를 파이프로 전달
//     '-vf',
//     'fps=1/10,scale=1280:720', // 10초마다 한 프레임을 캡처하고 해상도 조정
//     '-update',
//     '1', // 같은 파일에 덮어쓰기 활성화
//     `${dirPath}/${roomId}.jpg`, // 덮어쓸 출력 파일 이름
//   ];
//   return commandArgs;
// };

const commandArgs = (dirPath: string, roomId: string) => {
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
    '-crf',
    '20', // 비디오 품질 설정
    '-c:a',
    'aac', // 오디오 코덱
    '-b:a',
    '128k', // 오디오 비트레이트
    '-f',
    'hls', // HLS 출력 포맷
    '-hls_time',
    '4', // 각 세그먼트 길이 (초)
    '-hls_list_size',
    '0', // 유지할 세그먼트 개수
    '-hls_segment_filename',
    `${dirPath}/records/${roomId}/${roomId}_segment_%03d.ts`, // HLS 세그먼트 파일 이름
    `${dirPath}/records/${roomId}/${roomId}.m3u8`, // HLS 플레이리스트 파일 이름

    // 프레임 캡처
    '-vf',
    'fps=1/10,scale=1280:720', // 10초마다 한 프레임 캡처 및 해상도 조정
    '-q:v',
    '2', // 이미지 품질 설정 (낮을수록 고화질)
    '-update',
    '1', // 같은 파일에 덮어쓰기 활성화
    `${dirPath}/thumbnails/${roomId}.jpg`, // 덮어쓸 출력 파일 이름
  ];
  return commandArgs;
};

const createDir = (name: string) => {
  if (!fs.existsSync(name)) {
    fs.mkdirSync(name, { recursive: true });
  }
};
