import { NestFactory } from '@nestjs/core';
import { SchedulerMainModule } from './modules/main/scheduler-main.module';

async function bootstrap() {
  const app = await NestFactory.create(SchedulerMainModule);
  await app.listen(3000);
}
bootstrap();
