import * as os from 'node:os';
import path from 'path';
import { convertWebMToHLS } from './exchage';

export interface Video {
  roomId: string;
  randomStr: string;
  title: string;
}
const videoQueue: Video[] = [];
const videosDirPath = path.join(__dirname, '../assets/videos');
const recordsDirPath = path.join(__dirname, '../assets/records');

export const addVideoToQueue = (video: Video) => {
  videoQueue.push(video);
};

const exchangeToHls = async () => {
  console.log(usage);
  if (videoQueue.length === 0) {
    return;
  }
  if (usage >= 40) {
    return;
  }
  const video = videoQueue.shift();
  if (!video) {
    return;
  }
  const inputPath = path.join(videosDirPath, video.roomId, `${video.randomStr}.webm`);
  await convertWebMToHLS(inputPath, recordsDirPath, video.roomId);
};

let previousCpuData = os.cpus();
let usage = 0;

function calculateCpuUsage() {
  const currentCpuData = os.cpus(); // 현재 CPU 데이터
  let totalDiff = 0; // 전체 시간 변화량
  let idleDiff = 0; // 유휴 시간 변화량

  for (let i = 0; i < currentCpuData.length; i++) {
    const prev = previousCpuData[i].times;
    const curr = currentCpuData[i].times;

    // 현재와 이전 데이터의 차이를 계산
    const prevTotal = prev.user + prev.nice + prev.sys + prev.idle + prev.irq;
    const currTotal = curr.user + curr.nice + curr.sys + curr.idle + curr.irq;

    totalDiff += currTotal - prevTotal; // 전체 시간 차이
    idleDiff += curr.idle - prev.idle; // 유휴 시간 차이
  }

  // CPU 사용률 계산
  const usage = ((totalDiff - idleDiff) / totalDiff) * 100;

  // 이전 데이터를 업데이트
  previousCpuData = currentCpuData;

  return usage;
}

// 사용 예시
setInterval(() => {
  usage = calculateCpuUsage();
}, 5000);

const startProcess = async () => {
  while (true) {
    await exchangeToHls();
    await delay(5000);
  }
};

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

startProcess();
