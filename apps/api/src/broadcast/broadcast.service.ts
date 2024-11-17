import { Injectable } from '@nestjs/common';
import { Broadcast } from './broadcast.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CustomException } from 'src/common/responses/exceptions/custom.exception';
import { ErrorStatus } from 'src/common/responses/exceptions/errorStatus';

@Injectable()
export class BroadcastService {
  constructor(@InjectRepository(Broadcast) private readonly broadcastRepository: Repository<Broadcast>) {}

  async getAll() {
    return this.broadcastRepository
      .createQueryBuilder('broadcast')
      .leftJoinAndSelect('broadcast.member', 'member')
      .getMany();
  }

  async getBroadcastInfo(broadcastId: string) {
    const broadcast = await this.broadcastRepository
      .createQueryBuilder('broadcast')
      .leftJoinAndSelect('broadcast.member', 'member')
      .where('broadcast.id = :broadcastId', { broadcastId })
      .getOne();

    if (!broadcast) throw new CustomException(ErrorStatus.BROADCAST_NOT_FOUND);

    return broadcast;
  }
}
