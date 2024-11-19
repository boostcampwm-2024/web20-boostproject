import { Inject, Injectable } from '@nestjs/common';
import { CreateBroadcastDto } from './dto/createBroadcast.dto';
import { IBroadcastService } from './interfaces/broadcast-service.interface';
import { IApiClient } from 'src/common/clients/api-client.interface';
import { IBroadcast } from './interfaces/broadcast.interface';
import { CustomException } from 'src/common/responses/exceptions/custom.exception';
import { ErrorStatus } from 'src/common/responses/exceptions/errorStatus';
import { Member } from 'src/member/member.entity';

@Injectable()
export class BroadcastService implements IBroadcastService {
  constructor(
    @Inject('API_CLIENT')
    private readonly apiClient: IApiClient,
  ) {}

  /**
   * 새로운 방송을 생성합니다.
   * @param createBroadcastDto 방송 생성에 필요한 정보
   * @returns 생성된 방송 정보
   */
  async createBroadcast(createBroadcastDto: CreateBroadcastDto): Promise<IBroadcast> {
    return this.apiClient.post<IBroadcast>('/v1/broadcasts', createBroadcastDto);
  }

  /**
   * 방송의 시청자 수를 증가시킵니다.
   * @param broadcastId 방송 UUID
   * @returns 업데이트된 방송 정보
   */
  async incrementViewers(broadcastId: string): Promise<void> {
    await this.apiClient.put<void>(`/v1/broadcasts/${broadcastId}/viewers/increment`);
  }

  /**
   * 방송의 시청자 수를 감소시킵니다.
   * @param broadcastId 방송 UUID
   * @returns 업데이트된 방송 정보
   */
  async decrementViewers(broadcastId: string): Promise<void> {
    await this.apiClient.put<void>(`/v1/broadcasts/${broadcastId}/viewers/decrement`);
  }

  /**
   * 방송을 삭제합니다.
   * @param broadcastId 방송 UUID
   * @throws CustomException 방송을 찾을 수 없는 경우
   */
  // async deleteBroadcast(broadcastId: string): Promise<{ startTime: Date; member: Member }> {
  //   const broadcast = await this.broadcastRepository.findOne({
  //     where: { id: broadcastId },
  //   });

  //   if (!broadcast) {
  //     throw new CustomException(ErrorStatus.BROADCAST_NOT_FOUND);
  //   }

  //   await this.broadcastRepository.delete({ id: broadcastId });

  //   return {
  //     startTime: broadcast.startTime,
  //     member: broadcast.member,
  //   };
  // }

  /**
   * 방송을 삭제합니다.
   * @param broadcastId 방송 UUID
   * @throws CustomException 방송을 찾을 수 없는 경우
   */
  async deleteBroadcast(broadcastId: string): Promise<{ startTime: Date; member: Member }> {
    const broadcast = await this.broadcastRepository.findOne({
      where: { id: broadcastId },
    });

    if (!broadcast) {
      throw new CustomException(ErrorStatus.BROADCAST_NOT_FOUND);
    }

    await this.broadcastRepository.delete({ id: broadcastId });

    return {
      startTime: broadcast.startTime,
      member: broadcast.member,
    };
  }
}
