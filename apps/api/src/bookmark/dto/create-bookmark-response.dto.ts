import { ApiProperty } from '@nestjs/swagger';
import { Bookmark } from '../bookmark.entity';

export class CreateBookmarkResponseDto {
  @ApiProperty()
  bookmarkId: number;

  static from(bookmark: Bookmark) {
    const dto = new CreateBookmarkResponseDto();
    dto.bookmarkId = bookmark.id;
    return dto;
  }
}
