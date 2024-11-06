export class SuccessStatus<T = any> {
  constructor(
    readonly success: boolean,
    readonly status: string,
    readonly message: string,
    readonly data: T | null = null,
  ) {}
}
