import * as os from 'node:os';
import path from 'path';
import { convertWebMToHLS } from './exchage';

interface Video {
  roomId: string;
  randomStr: string;
  title: string;
}

const videoQueue: Video[] = [];
const videosDirPath = path.join(__dirname, '../assets/videos');
const recordsDirPath = path.join(__dirname, '../assets/records');
const cpuInfo = { previousCpuData: os.cpus(), usage: 0 };

export const addVideoToQueue = (video: Video) => {
  videoQueue.push(video);
};

const exchangeToHls = async () => {
  console.log('CPU USAGE: ', cpuInfo.usage);

  if (videoQueue.length === 0) return;
  if (cpuInfo.usage >= 40) return;

  const video = videoQueue.shift();

  if (!video) return;

  const inputPath = path.join(videosDirPath, video.roomId, `${video.randomStr}.webm`);

  await convertWebMToHLS(inputPath, recordsDirPath, video.roomId);
};

export function calculateCpuUsage() {
  const currentCpuData = os.cpus(); // 현재 CPU 데이터

  const diffs = currentCpuData.reduce(
    (acc, cur, idx) => {
      const prev = cpuInfo.previousCpuData[idx].times;
      const curr = cur.times;

      // 현재와 이전 데이터의 차이를 계산
      const prevTotal = prev.user + prev.nice + prev.sys + prev.idle + prev.irq;
      const currTotal = curr.user + curr.nice + curr.sys + curr.idle + curr.irq;

      acc.totalDiff += currTotal - prevTotal; // 전체 시간 차이
      acc.idleDiff += curr.idle - prev.idle; // 유휴 시간 차이

      return acc;
    },
    { totalDiff: 0, idleDiff: 0 },
  );

  // CPU 사용률 계산
  const usage = ((diffs.totalDiff - diffs.idleDiff) / diffs.totalDiff) * 100;

  // 이전 데이터를 업데이트
  cpuInfo.previousCpuData = currentCpuData;

  return usage;
}

export const startProcess = async () => {
  while (true) {
    await exchangeToHls();
    await delay(5000);
  }
};

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

setInterval(() => {
  cpuInfo.usage = calculateCpuUsage();
}, 5000);
