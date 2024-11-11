import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { TransformInterceptor } from './common/interceptor/transform.interceptor';
import { HttpExceptionFilter } from './common/filter/httpException.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalInterceptors(new TransformInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());

  const configService = app.get(ConfigService);
  const port = configService.get<number>('MEDIA_PORT');

  console.log(`Media Server is running on port ${port}`);
  await app.listen(port);
}
bootstrap();
