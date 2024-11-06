import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { CustomException } from './common/exceptions/custom.exception';
import { ErrorTypes } from './common/exceptions/errorTypes';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
  
  @Get('/success/1')
  getSuccessTest1(): string {
    return this.appService.getHello();
  }

  @Get('/success/2')
  getSuccessTest2(): Object {
    return { name: 'KIM', age: 23 };
  }

  @Get('/error/1')
  getErrorTest1(): string {
    throw new CustomException(ErrorTypes.INTERNAL_SERVER_ERROR);
  }

  @Get('/error/2')
  getErrorTest2(): string {
    throw new CustomException(ErrorTypes.INVALID_TOKEN);
  }

  @Get('/error/3')
  getErrorTest3(): string {
    throw new CustomException(ErrorTypes.UNAUTHORIZED);
  }
}
