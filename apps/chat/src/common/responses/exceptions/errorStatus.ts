export class ErrorStatus {
  constructor(readonly code: number, readonly status: string, readonly message: string) {}

  // Common Errors
  static readonly INTERNAL_SERVER_ERROR = new ErrorStatus(500, 'COMMON_5000', '서버 에러, 관리자에게 문의하세요.');

  static readonly BAD_REQUEST = new ErrorStatus(400, 'COMMON_4000', '잘못된 요청입니다.');

  static readonly UNAUTHORIZED = new ErrorStatus(401, 'COMMON_4001', '인증되지 않은 요청입니다.');

  static readonly API_SERVER_ERROR = new ErrorStatus(500, 'COMMON_5001', 'API 서비스 로직에서 문제가 발생했습니다.');

  // Chat Errors
  static readonly ROOM_NOT_FOUND = new ErrorStatus(404, 'CHAT_4000', '방 정보가 존재하지 않습니다.');

  static readonly NO_HAVE_AUTHORITY_IN_ROOM = new ErrorStatus(404, 'CHAT_4001', '채팅방에 제어 권한이 없습니다.');
}
