export class ErrorStatus {
  constructor(readonly code: number, readonly status: string, readonly message: string) {}

  // Common Errors
  static readonly INTERNAL_SERVER_ERROR = new ErrorStatus(500, 'COMMON_5000', '서버 에러, 관리자에게 문의하세요.');

  static readonly BAD_REQUEST = new ErrorStatus(400, 'COMMON_4000', '잘못된 요청입니다.');

  static readonly UNAUTHORIZED = new ErrorStatus(400, 'COMMON_4001', '인증되지 않은 요청입니다.');

  // User Errors
  static readonly USER_NOT_FOUND = new ErrorStatus(400, 'MEMBER_4000', '사용자를 찾을 수 없습니다.');

  static readonly INVALID_PASSWORD = new ErrorStatus(400, 'MEMBER_4001', '잘못된 비밀번호입니다.');

  static readonly INVALID_TOKEN = new ErrorStatus(400, 'MEMBER_4002', '유효하지 않은 토큰입니다.');
}
