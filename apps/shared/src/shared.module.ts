import { Module } from '@nestjs/common';
import { QueueFactoryService } from './services/queue-factory.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseConfiguration } from './database/database-config';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => {
        return new DatabaseConfiguration(config).connectionConfig;
      },
      inject: [ConfigService],
    })
  ],
  controllers: [],
  providers: [QueueFactoryService],
  exports: [QueueFactoryService]
})
export class SharedModule {}
