import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WebSocketExceptionFilter } from './common/filter/webSocketExceptionFilter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new WebSocketExceptionFilter());
  await app.listen(3002);
}
bootstrap();

process.on('uncaughtException', err => {
  console.log(err);
});
process.on('unhandledRejection', err => {
  console.log(err);
});
