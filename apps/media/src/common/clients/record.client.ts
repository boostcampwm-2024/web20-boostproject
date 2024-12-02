import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ErrorStatus } from '../responses/exceptions/errorStatus';
import { HttpService } from '@nestjs/axios';
import { CustomWsException } from '../responses/exceptions/custom-ws.exception';
import { IRecordClient } from './record-client.interface';

@Injectable()
export class RecordClient implements IRecordClient {
  constructor(private readonly httpService: HttpService, private readonly configService: ConfigService) {}

  private readonly baseUrl = this.configService.get<string>('RECORD_SERVER_URL');

  async post<T>(path: string, data: any): Promise<T> {
    try {
      const response = await this.httpService.post<T>(`${this.baseUrl}${path}`, data).toPromise();
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // TODO: Error custom 필요
  private handleError(_error: any): Error {
    throw new CustomWsException(ErrorStatus.RECORD_SERVER_ERROR);
  }
}
