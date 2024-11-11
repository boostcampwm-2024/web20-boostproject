import { SuccessStatus } from './successStatus';

export class SuccessResponse {
  constructor(private readonly successStatus: SuccessStatus) {}

  toResponse() {
    return {
      success: this.successStatus.success,
      status: this.successStatus.status,
      message: this.successStatus.message,
      data: this.successStatus.data,
    };
  }
}
