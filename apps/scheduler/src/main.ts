import { NestFactory } from '@nestjs/core';
import { SchedulerMainModule } from './modules/main/scheduler-main.module';

async function bootstrap() {
  const app = await NestFactory.create(SchedulerMainModule);
  const port = process.env.WORKER_PORT || 3001
  await app.listen(port);
  console.log('Listening', port)
}
bootstrap();
