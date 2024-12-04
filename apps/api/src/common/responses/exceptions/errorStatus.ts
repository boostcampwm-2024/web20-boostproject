export class ErrorStatus {
  constructor(readonly code: number, readonly status: string, readonly message: string) {}

  // Common Errors
  static readonly INTERNAL_SERVER_ERROR = new ErrorStatus(500, 'COMMON_5000', '서버 에러, 관리자에게 문의하세요.');

  static readonly BAD_REQUEST = new ErrorStatus(400, 'COMMON_4000', '잘못된 요청입니다.');

  static readonly UNAUTHORIZED = new ErrorStatus(401, 'COMMON_4001', '인증되지 않은 요청입니다.');

  // User Errors
  static readonly MEMBER_NOT_FOUND = new ErrorStatus(404, 'MEMBER_4000', '사용자를 찾을 수 없습니다.');

  static readonly INVALID_PASSWORD = new ErrorStatus(400, 'MEMBER_4001', '잘못된 비밀번호입니다.');

  static readonly INVALID_TOKEN = new ErrorStatus(401, 'MEMBER_4002', '유효하지 않은 토큰입니다.');

  static readonly INVALID_FIELD = new ErrorStatus(
    400,
    'MEMBER_4003',
    '유효하지 않은 분야입니다. (WEB, AND, IOS 중 하나여야 합니다)',
  );

  // Broadcast Errors
  static readonly BROADCAST_NOT_FOUND = new ErrorStatus(404, 'BROADCAST_4000', '방송 정보가 존재하지 않습니다.');
  static readonly BROADCAST_ALREADY_EXISTS = new ErrorStatus(400, 'BROADCAST_4001', '이미 존재하는 방송입니다.');

  //Attendance
  static readonly ATTENDANCE_NOT_FOUND = new ErrorStatus(404, 'ATTENDANCE_4000', '출석 정보가 존재하지 않습니다.');

  //Bookmark
  static readonly BOOKMARK_NOT_FOUND = new ErrorStatus(404, 'BROADCAST_4000', '북마크 정보가 존재하지 않습니다.');
  static readonly BOOKMARK_LIMIT_EXCEEDED = new ErrorStatus(400, 'BOOKMARK_4001', '이미 북마크가 5개 존재합니다.');

  //Record
  static readonly RECORD_NOT_FOUND = new ErrorStatus(404, 'RECORD_4000', '녹화 정보가 존재하지 않습니다.');
}
