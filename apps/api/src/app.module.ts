import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MemberModule } from './member/member.module';
import { BroadcastModule } from './broadcast/broadcast.module';
import { AttendanceModule } from './attendance/attendance.module';
import { WinstonModule } from 'nest-winston';
import { winstonConfig } from './config/winston.config';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeormConfig } from './config/typeorm.config';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { RecordModule } from './record/record.module';

@Module({
  imports: [
    WinstonModule.forRoot(winstonConfig),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => typeormConfig(configService),
      inject: [ConfigService],
    }),
    MemberModule,
    BroadcastModule,
    AttendanceModule,
    AuthModule,
    RecordModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
