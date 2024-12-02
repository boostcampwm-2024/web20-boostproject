export interface IApiClient {
  get<T>(path: string, token: string): Promise<T>;
}
