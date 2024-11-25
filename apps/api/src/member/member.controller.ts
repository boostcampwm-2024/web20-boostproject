import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { MemberService } from './member.service';
import { UserReq } from 'src/common/decorators/user-req.decorator';
import { Member } from './member.entity';
import { ApiSuccessResponse } from 'src/common/decorators/success-res.decorator';
import { SuccessStatus } from 'src/common/responses/bases/successStatus';
import { JWTAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { MemberInfoResponseDto } from './dto/member-info-response.dto';
import { SwaggerTag } from 'src/common/constants/swagger-tag.enum';
import { ApiErrorResponse } from 'src/common/decorators/error-res.decorator';
import { ErrorStatus } from 'src/common/responses/exceptions/errorStatus';
import { AttendanceResponseDto } from './dto/attendance-response.dto';

@Controller('/v1/members')
export class MemberController {
  constructor(private readonly memberService: MemberService) {}

  @Get('/info')
  @UseGuards(JWTAuthGuard)
  @ApiTags(SwaggerTag.MYPAGE)
  @ApiOperation({ summary: '내 정보 조회' })
  @ApiSuccessResponse(SuccessStatus.OK(MemberInfoResponseDto), MemberInfoResponseDto)
  @ApiErrorResponse(500, ErrorStatus.INTERNAL_SERVER_ERROR)
  @ApiErrorResponse(404, ErrorStatus.MEMBER_NOT_FOUND)
  async getInfo(@UserReq() member: Member) {
    return await this.memberService.getMemberInfo(member.id);
  }

  @Get('/attendance')
  @UseGuards(JWTAuthGuard)
  @ApiTags(SwaggerTag.MYPAGE)
  @ApiOperation({ summary: '내 출석 내역 조회' })
  @ApiSuccessResponse(SuccessStatus.OK(AttendanceResponseDto), AttendanceResponseDto)
  async getAttendance(@UserReq() member: Member) {
    return await this.memberService.getMemberAttendance(member.id);
  }
}
