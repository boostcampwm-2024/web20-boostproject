import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { IApiClient } from 'src/broadcast/interfaces/api-client.interface';
import { CustomException } from '../responses/exceptions/custom.exception';
import { ErrorStatus } from '../responses/exceptions/errorStatus';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class ApiClient implements IApiClient {
  constructor(private readonly httpService: HttpService, private readonly configService: ConfigService) {}

  private readonly baseUrl = this.configService.get<string>('API_SERVER_URL');

  async post<T>(path: string, data: any): Promise<T> {
    try {
      const response = await this.httpService.post<T>(`${this.baseUrl}${path}`, data).toPromise();
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async put<T>(path: string, data?: any): Promise<T> {
    try {
      const response = await this.httpService.put<T>(`${this.baseUrl}${path}`, data).toPromise();
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // TODO: Error custom 필요
  private handleError(_error: any): Error {
    throw new CustomException(ErrorStatus.API_SERVER_ERROR);
  }
}
