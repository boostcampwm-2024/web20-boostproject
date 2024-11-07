import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { CustomException } from './common/responses/exceptions/custom.exception';
import { ErrorStatus } from './common/responses/exceptions/errorStatus';
import { SuccessStatus } from './common/responses/bases/successStatus';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/success/1')
  getSuccessTest1(): SuccessStatus {
    const data = { name: 'KIM', age: 23 };
    return SuccessStatus.OK(data, '사용자 정보 조회 성공');
  }

  @Get('/success/2')
  getSuccessTest2(): SuccessStatus {
    return SuccessStatus.CREATED('사용자가 성공적으로 생성되었습니다.');
  }

  @Get('/success/3')
  getSuccessTest3(): SuccessStatus {
    return SuccessStatus.NO_CONTENT('처리가 완료되었습니다.');
  }

  @Get('/success/4')
  getSuccessTest4(): SuccessStatus {
    const specialData = { specialKey: 'specialValue' };
    return SuccessStatus.OK(specialData, '특별한 데이터 조회 성공');
  }

  @Get('/error/1')
  getErrorTest1(): string {
    throw new CustomException(ErrorStatus.INTERNAL_SERVER_ERROR);
  }

  @Get('/error/2')
  getErrorTest2(): string {
    throw new CustomException(ErrorStatus.INVALID_TOKEN);
  }

  @Get('/error/3')
  getErrorTest3(): string {
    throw new CustomException(ErrorStatus.UNAUTHORIZED);
  }
}
