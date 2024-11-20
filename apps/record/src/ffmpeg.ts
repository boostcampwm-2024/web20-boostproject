import { spawn } from 'child_process';

export const createFfmpegProcess = () => {
  const sdpString = createSdpText();
  const ffmpegProcess = spawn('ffmpeg', commandArgs());
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
  ffmpegProcess.stderr.on('data', data => {
    console.log(`FFmpeg log: ${data}`);
  });
  ffmpegProcess.stdout.on('data', data => console.log('ffmpeg::stdout [data:%o]', data));
  ffmpegProcess.stdout.on('message', message => console.log('ffmpeg::stdout [data:%o]', message));

  ffmpegProcess.stderr.on('message', message => console.log('ffmpeg::process::message [message:%o]', message));
  ffmpegProcess.on('error', error => console.error('ffmpeg::process::error [error:%o]', error));
  ffmpegProcess.on('close', code => {
    console.log(`FFmpeg process exited with code: ${code}`);
  });
};

const createSdpText = () => {
  return `v=0
o=- 0 0 IN IP4 127.0.0.1
s=FFmpeg
c=IN IP4 127.0.0.1
t=0 0
m=video 5000 RTP/AVP 101 
a=rtpmap:101 VP8/90000
a=sendonly
`;
};

const commandArgs = () => {
  const commandArgs = [
    '-protocol_whitelist',
    'pipe,udp,rtp', // 허용할 프로토콜 정의
    '-f',
    'sdp', // 입력 포맷
    '-i',
    'pipe:0', // SDP를 파이프로 전달
    '-c:v',
    'copy', // 디코딩 없이 비디오 복사
    'output.webm', // 출력 파일
    '-frames:v',
    '1',
    '-q:v',
    '2',
    '-vf',
    'scale=1280:720',
    'thumbnail.jpg',
  ];
  return commandArgs;
};

// const commandArgs = () => {
//   const commandArgs = [
//     '-protocol_whitelist',
//     'pipe,udp,rtp', // 허용할 프로토콜 정의
//     '-f',
//     'sdp', // 입력 포맷
//     '-i',
//     'pipe:0', // SDP를 파이프로 전달
//     '-c:v',
//     'libx264', // 고품질 H.264 코덱 사용
//     '-frames:v',
//     '1', // 1프레임만 출력 (썸네일 생성)
//     '-q:v',
//     '1', // 품질 설정 (낮을수록 고품질)
//     '-vf',
//     'scale=1280:720', // 해상도 설정
//     'thumbnail.jpg', // 출력 썸네일 파일
//     'output.webm', // 출력 비디오 파일
//   ];
//   return commandArgs;
// };
