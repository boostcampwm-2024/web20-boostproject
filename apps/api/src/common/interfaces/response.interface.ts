export interface SuccessResponseFormat<T> {
  status: string;
  success: boolean;
  message: string;
  data: T;
}

export interface ErrorResponseFormat<T> {
  status: string;
  success: boolean;
  message: string;
}
