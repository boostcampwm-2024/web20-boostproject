import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IApiClient } from './api-client.interface';
import { ErrorStatus } from '../responses/exceptions/errorStatus';
import { HttpService } from '@nestjs/axios';
import { CustomWsException } from '../responses/exceptions/custom-ws.exception';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ApiClient implements IApiClient {
  constructor(private readonly httpService: HttpService, private readonly configService: ConfigService) {}

  private readonly baseUrl = this.configService.get<string>('API_SERVER_URL');

  async get<T>(path: string, token?: string): Promise<T> {
    try {
      const response = await firstValueFrom(
        this.httpService.get<T>(`${this.baseUrl}${path}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
      );
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // TODO: Error custom 필요
  private handleError(_error: any): Error {
    throw new CustomWsException(ErrorStatus.API_SERVER_ERROR);
  }
}
