import { Injectable } from '@nestjs/common';
import { Broadcast } from './broadcast.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThan, Repository } from 'typeorm';
import { CreateBroadcastDto } from './dto/createBroadcast.dto';
import { CustomException } from 'src/common/responses/exceptions/custom.exception';
import { ErrorStatus } from 'src/common/responses/exceptions/errorStatus';

@Injectable()
export class BroadcastService {
  constructor(
    @InjectRepository(Broadcast)
    private readonly broadcastRepository: Repository<Broadcast>,
  ) {}

  /**
   * 새로운 방송을 생성합니다.
   * @param createBroadcastDto 방송 생성에 필요한 정보
   * @returns 생성된 방송 정보
   */
  async createBroadcast(createBroadcastDto: CreateBroadcastDto): Promise<Broadcast> {
    const { id, title } = createBroadcastDto;

    const broadcast = this.broadcastRepository.create({
      id,
      title,
      member: null, // 현재 방송자에 대한 부분은 논의 후 로직 적용
    });

    return await this.broadcastRepository.save(broadcast);
  }

  /**
   * 방송의 시청자 수를 증가시킵니다.
   * @param broadcastId 방송 UUID
   * @returns 업데이트된 방송 정보
   */
  async incrementViewers(broadcastId: string): Promise<void> {
    const broadcast = await this.broadcastRepository.findOne({
      where: { id: broadcastId },
    });

    if (!broadcast) {
      throw new CustomException(ErrorStatus.BROADCAST_NOT_FOUND);
    }

    await this.broadcastRepository.update({ id: broadcastId }, { viewers: () => 'viewers + 1' });
  }

  /**
   * 방송의 시청자 수를 감소시킵니다.
   * @param broadcastId 방송 UUID
   * @returns 업데이트된 방송 정보
   */
  async decrementViewers(broadcastId: string): Promise<void> {
    const broadcast = await this.broadcastRepository.findOne({
      where: { id: broadcastId },
    });

    if (!broadcast) {
      throw new CustomException(ErrorStatus.BROADCAST_NOT_FOUND);
    }

    await this.broadcastRepository.update({ id: broadcastId, viewers: MoreThan(0) }, { viewers: () => 'viewers - 1' });
  }
}
