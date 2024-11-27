import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import fs from 'fs';
import dotenv from 'dotenv';
import path from 'path';
dotenv.config();

const endpoint = 'https://kr.object.ncloudstorage.com';
const region = 'kr-standard';

const ACCESS_KEY = process.env.NCLOUD_ACCESS_KEY;
const SECRET_KEY = process.env.NCLOUD_SECRET_KEY;
const BUCKET_NAME = process.env.NCLOUD_BUCKET_NAME;

if (!ACCESS_KEY || !SECRET_KEY) {
  throw new Error('Access key or secret key is missing');
}

const s3Client = new S3Client({
  region,
  endpoint,
  credentials: {
    accessKeyId: ACCESS_KEY,
    secretAccessKey: SECRET_KEY,
  },
});

export const uploadObjectFromDir = async (roomId: string, dirPath: string) => {
  const folderPath = `${dirPath}/${roomId}`;
  const files = fs.readdirSync(folderPath);
  const endTime = `${formatDate(new Date())}_${formatTime(new Date())}`;

  for (const file of files) {
    const filePath = path.join(folderPath, file);
    const fileStream = fs.createReadStream(filePath);
    const objectKey = `records/${roomId}/${endTime}/${file}`;
    try {
      const command = new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: objectKey,
        Body: fileStream,
        ACL: 'public-read',
      });
      await s3Client.send(command);
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  }
};

const formatDate = (date: Date) => {
  return date
    .toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
    .replace(/\. /g, '.')
    .slice(0, -1);
};

const formatTime = (date: Date) => {
  return date.toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
};
