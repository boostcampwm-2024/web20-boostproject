export class ErrorStatus {
  constructor(readonly code: number, readonly status: string, readonly message: string) {}

  // Common Errors
  static readonly INTERNAL_SERVER_ERROR = new ErrorStatus(500, 'COMMON_5000', '서버 에러, 관리자에게 문의하세요.');

  static readonly BAD_REQUEST = new ErrorStatus(400, 'COMMON_4000', '잘못된 요청입니다.');

  static readonly UNAUTHORIZED = new ErrorStatus(400, 'COMMON_4001', '인증되지 않은 요청입니다.');

  // User Errors
  static readonly USER_NOT_FOUND = new ErrorStatus(404, 'MEMBER_4000', '사용자를 찾을 수 없습니다.');

  static readonly INVALID_PASSWORD = new ErrorStatus(400, 'MEMBER_4001', '잘못된 비밀번호입니다.');

  static readonly INVALID_TOKEN = new ErrorStatus(400, 'MEMBER_4002', '유효하지 않은 토큰입니다.');

  // Media Errors
  static readonly ROOM_NOT_FOUND = new ErrorStatus(404, 'MEDIA_4000', '방 정보가 존재하지 않습니다.');
  static readonly PRODUCER_ALREADY_EXISTS_IN_ROOM = new ErrorStatus(
    400,
    'MEDIA_4001',
    '방에 방송자가 이미 존재 합니다.',
  );
  static readonly TRANSPORT_NOT_FOUND = new ErrorStatus(404, 'MEDIA_4002', 'TRANSPORT 정보가 존재하지 않습니다.');
  static readonly NO_HAVE_PRODUCER_TRANSPORT_IN_ROOM = new ErrorStatus(
    404,
    'MEDIA_4003',
    '방에 PRODUCER TRANSPORT가 존재하지 않습니다.',
  );

  // Broadcast Errors
  static readonly BROADCAST_NOT_FOUND = new ErrorStatus(404, 'BROADCAST_4000', '방송 정보가 존재하지 않습니다.');
  static readonly CANNOT_CONSUME_PRODUCER = new ErrorStatus(
    400,
    'MEDIA_4003',
    'CONSUME할 수 있는 PRODUCER가 없습니다.',
  );

  // Worker Errors
  static readonly WORKER_NOT_FOUND = new ErrorStatus(404, 'WORKER_4000', 'Worker 정보가 존재하지 않습니다.');
}
