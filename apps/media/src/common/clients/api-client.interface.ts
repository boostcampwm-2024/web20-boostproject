export interface IApiClient {
  post<T>(path: string, data: any): Promise<T>;
  put<T>(path: string, data?: any): Promise<T>;
  delete<T>(path: string, data?: any): Promise<T>;
  get<T>(path: string, token: string): Promise<T>;
}
