import { Module } from '@nestjs/common';
import { QueueFactoryService } from './services/queue-factory.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  controllers: [],
  providers: [QueueFactoryService],
  exports: [QueueFactoryService]
})
export class SharedModule {}
