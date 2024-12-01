import { ApiProperty } from '@nestjs/swagger';
import { Bookmark } from '../bookmark.entity';

class BookmarkDto {
  @ApiProperty()
  bookmarkId: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  url: string;

  static from(bookmark: Bookmark) {
    const dto = new BookmarkDto();
    dto.bookmarkId = bookmark.id;
    dto.name = bookmark.name;
    dto.url = bookmark.url;
    return dto;
  }

  static fromList(bookmarks: Bookmark[]) {
    return bookmarks.map(bookmark => this.from(bookmark));
  }
}

export class BookmarkListResponseDto {
  @ApiProperty({
    type: BookmarkDto,
    isArray: true,
  })
  bookmarks: BookmarkDto[];

  static from(bookmarks: Bookmark[]) {
    const dto = new BookmarkListResponseDto();
    dto.bookmarks = BookmarkDto.fromList(bookmarks);
    return dto;
  }
}
