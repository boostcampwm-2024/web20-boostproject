import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { BookmarkService } from './bookmark.service';
import { JWTAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { UserReq } from 'src/common/decorators/user-req.decorator';
import { Member } from 'src/member/member.entity';
import { CreateBookmarkDto } from './dto/create-bookmark.dto';

@Controller('v1/bookmarks')
@UseGuards(JWTAuthGuard)
export class BookmarkController {
  constructor(private readonly bookmarkService: BookmarkService) {}

  @Post()
  async createBookmark(@UserReq() member: Member, @Body() createBookmarkDto: CreateBookmarkDto) {
    const { id: bookmarkId } = await this.bookmarkService.createBookmark(member, createBookmarkDto);

    return {
      bookmarkId,
    };
  }
}
