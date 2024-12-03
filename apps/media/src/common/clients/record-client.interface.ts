export interface IRecordClient {
  post<T>(path: string, data: any): Promise<T>;
}
