import { Inject, Injectable } from '@nestjs/common';
import { IMemberService } from './interfaces/member-service.interface';
import { IApiClient } from 'src/common/clients/api-client.interface';
import { IMember } from './interfaces/member.interface';

@Injectable()
export class MemberService implements IMemberService {
  constructor(
    @Inject('API_CLIENT')
    private readonly apiClient: IApiClient,
  ) {}

  async getMemberInfo(token: string): Promise<IMember> {
    return this.apiClient.get<IMember>('/v1/members/info', token);
  }
}
