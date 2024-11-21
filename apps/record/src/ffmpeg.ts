import { spawn } from 'child_process';

export const createFfmpegProcess = (port: number, dirPath: string, roomId: string) => {
  const sdpString = createSdpText(port);
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

const commandArgs = (dirPath: string, roomId: string) => {
  const commandArgs = [
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
    `${dirPath}/${roomId}.jpg`, // 덮어쓸 출력 파일 이름
  ];
  return commandArgs;
};
