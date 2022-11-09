import { Module } from '@nestjs/common';
import { ConfigModule} from '@nestjs/config';
import { JobModule } from '../job/job.module';
import configuration from '../../../configuration/configuration';

@Module({
  imports: [
    ConfigModule.forRoot(configuration()),
    JobModule
  ],
  controllers: [],
  providers: [],
})
export class ApiMainModule {}
