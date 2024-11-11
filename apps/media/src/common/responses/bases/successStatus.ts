export class SuccessStatus<T = any> {
  constructor(
    readonly success: boolean,
    readonly status: string,
    readonly message: string,
    readonly data: T | null = null,
  ) {}

  static readonly OK = <T>(data: T, message: string = 'OK.') => new SuccessStatus(true, '200', message, data);

  static readonly CREATED = (message: string = '생성되었습니다.') => new SuccessStatus(true, '201', message);

  static readonly NO_CONTENT = (message: string = '성공적으로 처리되었습니다.') =>
    new SuccessStatus(true, '204', message);
}
