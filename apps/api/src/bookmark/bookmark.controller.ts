import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { BookmarkService } from './bookmark.service';
import { JWTAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { UserReq } from 'src/common/decorators/user-req.decorator';
import { Member } from 'src/member/member.entity';
import { CreateBookmarkDto } from './dto/create-bookmark.dto';
import { BookmarkListResponseDto } from './dto/bookmark-list-response.dto';
import { SuccessStatus } from 'src/common/responses/bases/successStatus';
import { SwaggerTag } from 'src/common/constants/swagger-tag.enum';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiSuccessResponse } from 'src/common/decorators/success-res.decorator';
import { ApiErrorResponse } from 'src/common/decorators/error-res.decorator';
import { ErrorStatus } from 'src/common/responses/exceptions/errorStatus';
import { CreateBookmarkResponseDto } from './dto/create-bookmark-response.dto';

@Controller('v1/bookmarks')
@UseGuards(JWTAuthGuard)
export class BookmarkController {
  constructor(private readonly bookmarkService: BookmarkService) {}

  @Post()
  @ApiTags(SwaggerTag.MAIN)
  @ApiOperation({ summary: '북마크 생성' })
  @ApiBody({ type: CreateBookmarkDto })
  @ApiSuccessResponse(SuccessStatus.OK(CreateBookmarkResponseDto), CreateBookmarkResponseDto)
  @ApiErrorResponse(400, ErrorStatus.BOOKMARK_LIMIT_EXCEEDED)
  @ApiErrorResponse(500, ErrorStatus.INTERNAL_SERVER_ERROR)
  async createBookmark(@UserReq() member: Member, @Body() createBookmarkDto: CreateBookmarkDto) {
    const bookmark = await this.bookmarkService.createBookmark(member, createBookmarkDto);

    return CreateBookmarkResponseDto.from(bookmark);
  }

  @Get()
  @ApiTags(SwaggerTag.MAIN)
  @ApiOperation({ summary: '북마크 리스트 조회' })
  @ApiSuccessResponse(SuccessStatus.OK(BookmarkListResponseDto), BookmarkListResponseDto)
  @ApiErrorResponse(500, ErrorStatus.INTERNAL_SERVER_ERROR)
  async getAllBookmarks(@UserReq() member: Member) {
    const bookmarks = await this.bookmarkService.getAllBookmarks(member);

    return BookmarkListResponseDto.from(bookmarks);
  }

  @Delete(':bookmarkId')
  @ApiTags(SwaggerTag.MAIN)
  @ApiOperation({ summary: '북마크 삭제' })
  @ApiSuccessResponse(SuccessStatus.NO_CONTENT())
  @ApiErrorResponse(400, ErrorStatus.BOOKMARK_NOT_FOUND)
  @ApiErrorResponse(500, ErrorStatus.INTERNAL_SERVER_ERROR)
  async deleteBookmark(@Param('bookmarkId') bookmarkId: number) {
    await this.bookmarkService.deleteBookmark(bookmarkId);

    return SuccessStatus.NO_CONTENT();
  }
}
