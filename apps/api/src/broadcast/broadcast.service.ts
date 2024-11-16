import { Injectable } from '@nestjs/common';
import { Broadcast } from './broadcast.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class BroadcastService {
  constructor(@InjectRepository(Broadcast) private readonly broadcastRepository: Repository<Broadcast>) {}

  async getAll() {
    return this.broadcastRepository
      .createQueryBuilder('broadcast')
      .leftJoinAndSelect('broadcast.member', 'member')
      .getMany();
  }
}
