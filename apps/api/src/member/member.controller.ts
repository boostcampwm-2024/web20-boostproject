import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { JWTAuthGuard } from '../auth/guard/jwt-auth.guard';
import { UpdateMemberInfoDto } from './dto/update-member-info.dto';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SwaggerTag } from '../common/constants/swagger-tag.enum';
import { MemberService } from './member.service';
import { UserReq } from '../common/decorators/user-req.decorator';
import { Member } from './member.entity';
import { ApiSuccessResponse } from '../common/decorators/success-res.decorator';
import { SuccessStatus } from '../common/responses/bases/successStatus';
import { ApiErrorResponse } from '../common/decorators/error-res.decorator';
import { ErrorStatus } from '../common/responses/exceptions/errorStatus';
import { ProfileImageDto } from './dto/profile-image.dto';
import { MemberInfoResponseDto } from './dto/member-info-response.dto';
import { AttendanceResponseDto } from './dto/attendance-response.dto';

@Controller('v1/members')
@UseGuards(JWTAuthGuard)
@ApiBearerAuth()
export class MemberController {
  constructor(private readonly memberService: MemberService) {}

  @Patch('info')
  @ApiTags(SwaggerTag.MYPAGE)
  @ApiOperation({ summary: '내 정보 수정' })
  @ApiBody({ type: UpdateMemberInfoDto })
  @ApiSuccessResponse(SuccessStatus.OK(null))
  @ApiErrorResponse(500, ErrorStatus.INTERNAL_SERVER_ERROR)
  @ApiErrorResponse(400, ErrorStatus.INVALID_TOKEN)
  async updateMemberInfo(@UserReq() member: Member, @Body() updateMemberInfoDto: UpdateMemberInfoDto) {
    await this.memberService.updateMemberInfo(member.id, updateMemberInfoDto.toMember());
  }

  @Get('profile-image')
  @ApiTags(SwaggerTag.HEADER)
  @ApiOperation({ summary: '프로필 이미지 조회' })
  @ApiSuccessResponse(SuccessStatus.OK(ProfileImageDto), ProfileImageDto)
  @ApiErrorResponse(500, ErrorStatus.INTERNAL_SERVER_ERROR)
  @ApiErrorResponse(400, ErrorStatus.INVALID_TOKEN)
  async getProfileImage(@UserReq() member: Member) {
    return ProfileImageDto.from(member);
  }

  @Get('/info')
  @UseGuards(JWTAuthGuard)
  @ApiTags(SwaggerTag.MYPAGE)
  @ApiOperation({ summary: '내 정보 조회' })
  @ApiSuccessResponse(SuccessStatus.OK(MemberInfoResponseDto), MemberInfoResponseDto)
  @ApiErrorResponse(500, ErrorStatus.INTERNAL_SERVER_ERROR)
  @ApiErrorResponse(404, ErrorStatus.MEMBER_NOT_FOUND)
  async getInfo(@UserReq() member: Member) {
    return MemberInfoResponseDto.from(member);
  }

  @Get('/attendance')
  @UseGuards(JWTAuthGuard)
  @ApiTags(SwaggerTag.MYPAGE)
  @ApiOperation({ summary: '내 출석 내역 조회' })
  @ApiSuccessResponse(SuccessStatus.OK(AttendanceResponseDto), AttendanceResponseDto)
  async getAttendance(@UserReq() member: Member) {
    const attendances = await this.memberService.getMemberAttendance(member.id);

    return AttendanceResponseDto.of(member.id, attendances);
  }
}
