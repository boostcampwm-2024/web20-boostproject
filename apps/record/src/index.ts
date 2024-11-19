import dotenv from 'dotenv';
import { spawn } from 'child_process';
import { path } from '@ffmpeg-installer/ffmpeg';
import ffmpeg from 'fluent-ffmpeg';
import dgram from 'dgram';
// import fs from 'fs';
import * as path2 from 'path';

dotenv.config();
const sdpFilePath = path2.join(__dirname, 'stream.sdp');

const PORT = process.env.RECORD_PORT || '3003';
ffmpeg.setFfmpegPath(path);

// UDP 서버 생성
const server = dgram.createSocket('udp4');

// FFmpeg 프로세스를 저장할 변수
let ffmpegProcess: any = null;

// FFmpeg 실행 함수
function startFFmpeg() {
  if (ffmpegProcess) {
    console.log('FFmpeg is already running');
    return;
  }

  ffmpegProcess = spawn('ffmpeg', [
    '-protocol_whitelist',
    'file,udp,rtp',
    '-f',
    'rtp',
    '-i',
    sdpFilePath,
    `rtp://0.0.0.0:5000`,
    '-c:v',
    'copy',
    'output.mp4',
  ]);

  ffmpegProcess.stderr.on('data', (data: any) => {
    console.log(`FFmpeg log: ${data}`);
  });

  ffmpegProcess.on('error', (error: any) => {
    console.error('FFmpeg error:', error);
  });

  ffmpegProcess.on('close', (code: any) => {
    console.log(`FFmpeg process closed with code: ${code}`);
    ffmpegProcess = null;
  });

  console.log('FFmpeg process started to record stream.');
}

// FFmpeg 종료 함수
function stopFFmpeg() {
  if (ffmpegProcess) {
    ffmpegProcess.kill('SIGTERM');
    ffmpegProcess = null;
    console.log('FFmpeg process stopped.');
  }
}

// UDP 서버 이벤트 핸들러
server.on('error', err => {
  console.error(`UDP server error:\n${err.stack}`);
  server.close();
});

server.on('message', (msg, rinfo) => {
  // RTP 패킷이 도착하면 자동으로 FFmpeg 시작
  if (!ffmpegProcess) {
    startFFmpeg();
  }
  console.log(`Received ${msg.length} bytes from ${rinfo.address}:${rinfo.port}`);
});

// 서버 시작
server.bind(parseInt(PORT));

// 프로세스 종료 시 정리
process.on('SIGINT', () => {
  stopFFmpeg();
  server.close();
  process.exit();
});

startFFmpeg();

export default server;
