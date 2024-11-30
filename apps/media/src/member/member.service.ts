import { Inject, Injectable } from '@nestjs/common';
import { IApiClient } from '../common/clients/api-client.interface';

@Injectable()
export class MemberService {
  constructor(
    @Inject('API_CLIENT')
    private readonly apiClient: IApiClient,
  ) {}

  findMemberById(token: string) {
    return this.apiClient.get(`/v1/members/info`, token);
  }
}
