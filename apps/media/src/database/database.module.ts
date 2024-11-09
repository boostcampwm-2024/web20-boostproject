import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Client } from 'ssh2';
import * as fs from 'fs';
import * as path from 'path';
import * as net from 'net';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const sshConfig = {
          host: configService.get('BASTION_HOST'),
          port: 22,
          username: configService.get('BASTION_USERNAME'),
          privateKey: fs.readFileSync(path.resolve(configService.get('BASTION_PRIVATE_KEY_PATH')), 'utf8'),
        };

        await new Promise((resolve, reject) => {
          const ssh = new Client();

          ssh.on('ready', () => {
            ssh.forwardOut(
              '127.0.0.1', // local bound host
              33306, // local bound port
              configService.get('DB_HOST'), // remote host
              3306, // remote port
              (err, stream) => {
                if (err) {
                  console.error('Tunnel stream error:', err);
                  reject(err);
                  return;
                }

                const server = net
                  .createServer(sock => {
                    sock.pipe(stream).pipe(sock);
                  })
                  .listen(33306, '127.0.0.1');

                server.on('listening', () => {
                  console.log('SSH tunnel established successfully');
                  resolve(true);
                });

                server.on('error', err => {
                  console.error('Server error:', err);
                  reject(err);
                });
              },
            );
          });

          ssh.on('error', err => {
            console.error('SSH connection error:', err);
            reject(err);
          });

          ssh.connect(sshConfig);
        });

        return {
          type: 'mysql',
          host: '127.0.0.1',
          port: 33306,
          username: configService.get('DB_USERNAME'),
          password: configService.get('DB_PASSWORD'),
          database: configService.get('DB_DATABASE'),
          entities: [__dirname + '/../**/*.entity{.ts,.js}'],
          synchronize: configService.get('DB_SYNC') === 'true',
          logging: true,
          connectTimeout: 60000,
        };
      },
    }),
  ],
})
export class DatabaseModule {}
