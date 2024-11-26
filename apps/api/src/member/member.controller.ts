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
}
