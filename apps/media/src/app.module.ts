import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MysqlDatabaseModule } from './database/mysql.module';
// import { RedisCacheModule } from './database/redis.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['../../.env', `../../.env.${process.env.NODE_ENV || 'development'}`],
    }),
    MysqlDatabaseModule,
    // RedisCacheModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
