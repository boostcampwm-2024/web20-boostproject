import * as winston from 'winston';
import 'winston-daily-rotate-file';
import { WinstonModule } from 'nest-winston';

export const winstonConfig = {
  transports: [
    new winston.transports.Console({
      level: process.env.NODE_ENV === 'production' ? 'info' : 'silly', // 환경에 따른 로그 레벨 설정
      format: winston.format.combine(
        winston.format.colorize({ all: true }), // 컬러 설정
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.printf(({ level, message, timestamp }) => {
          return `[${timestamp}] [${level}]: ${message}`;
        }),
      ),
    }),
    new winston.transports.DailyRotateFile({
      filename: '%DATE%.log',
      dirname: 'logs',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d',
      format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.printf(({ level, message, timestamp }) => {
          return `[${timestamp}] [${level.toUpperCase()}]: ${message}`;
        }),
      ),
    }),
  ],
};
