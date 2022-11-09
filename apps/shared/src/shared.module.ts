import { Module } from '@nestjs/common';
import { QueueFactoryService } from './services/queue-factory.service';

@Module({
  imports: [],
  controllers: [],
  providers: [QueueFactoryService],
})
export class SharedModule {}
