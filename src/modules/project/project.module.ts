
import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';

@Module({
  imports: [ DatabaseModule ],
  controllers: [ProjectController],
  providers: [ProjectService],
  exports: [ProjectService]
})
export class ProjectModule {}