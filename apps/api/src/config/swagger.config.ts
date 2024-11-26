import { INestApplication } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { SwaggerTag } from 'src/common/constants/swagger-tag.enum';

export class ConfigSwagger {
  static setup(app: INestApplication<any>) {
    const config = new DocumentBuilder()
      .setTitle("Cam'ON API 문서")
      .setDescription("Cam'ON 서비스의 api 문서입니다.")
      .setVersion('1.0')
      .addBearerAuth()
      .addTag(SwaggerTag.HEADER)
      .addTag(SwaggerTag.MAIN)
      .addTag(SwaggerTag.WATCH)
      .addTag(SwaggerTag.BROADCAST)
      .addTag(SwaggerTag.MYPAGE)
      .build();

    const document = SwaggerModule.createDocument(app, config);

    SwaggerModule.setup('camon-api-docs', app, document);
  }
}
