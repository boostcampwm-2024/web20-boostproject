import { Inject, Injectable } from '@nestjs/common';
import { CreateBroadcastDto } from './dto/createBroadcast.dto';
import { IBroadcastService } from './interfaces/broadcast-service.interface';
import { IApiClient } from './interfaces/api-client.interface';
import { IBroadcast } from './interfaces/broadcast.interface';

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
}
