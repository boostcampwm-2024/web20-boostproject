import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['../../.env', `../../.env.${process.env.NODE_ENV || 'development'}`],
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
