import { ApiProperty } from '@nestjs/swagger';

export class SigninResponseDto {
  @ApiProperty({ example: 'hseifoefshio.ehfioewfhioefwhi.hioaefoehifefwhiofehioefswioh' })
  accessToken: string;
}
