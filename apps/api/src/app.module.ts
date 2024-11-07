import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MemberModule } from './member/member.module';
import { BroadcastModule } from './broadcast/broadcast.module';
import { AttendanceModule } from './attendance/attendance.module';
import { WinstonModule } from 'nest-winston';
import { winstonConfig } from './config/winston.config';
import { LoggerMiddleware } from './common/middleware/logger.middleware';

@Module({
  imports: [WinstonModule.forRoot(winstonConfig), MemberModule, BroadcastModule, AttendanceModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
