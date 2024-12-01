import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Bookmark } from './bookmark.entity';
import { Repository } from 'typeorm';
import { CreateBookmarkDto } from './dto/create-bookmark.dto';
import { Member } from 'src/member/member.entity';
import { CustomException } from 'src/common/responses/exceptions/custom.exception';
import { ErrorStatus } from 'src/common/responses/exceptions/errorStatus';

@Injectable()
export class BookmarkService {
  constructor(@InjectRepository(Bookmark) private readonly bookmarkRepository: Repository<Bookmark>) {}

  async createBookmark(member: Member, createBookmarkDto: CreateBookmarkDto) {
    const { name, url } = createBookmarkDto;

    const bookmarkCnt = await this.bookmarkRepository.count({
      where: {
        member: {
          id: member.id,
        },
      },
    });

    if (bookmarkCnt >= 5) {
      throw new CustomException(ErrorStatus.BOOKMARK_LIMIT_EXCEEDED);
    }

    const bookmark = this.bookmarkRepository.create({ name, url, member });

    return this.bookmarkRepository.save(bookmark);
  }

  async getAllBookmarks(member: Member) {
    return this.bookmarkRepository.find({
      where: {
        member: {
          id: member.id,
        },
      },
    });
  }
}
