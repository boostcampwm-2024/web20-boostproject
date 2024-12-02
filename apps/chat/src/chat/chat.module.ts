import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { AuthModule } from 'src/auth/auth.module';
import { MemberModule } from 'src/member/member.module';

@Module({
  imports: [AuthModule, MemberModule],
  providers: [ChatGateway, ChatService],
})
export class ChatModule {}
