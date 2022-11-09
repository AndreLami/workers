import { NestFactory } from '@nestjs/core';
import { ApiMainModule } from './modules/main/api-main.module';

async function bootstrap() {
  const app = await NestFactory.create(ApiMainModule);
  const PORT = process.env.TASKS_PORT || 3000;
  await app.listen(PORT);
}
bootstrap();
