import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OhipController } from './ohip.controller';
import { OhipService } from './ohip.service';
import { OhipCode } from './ohip-code.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OhipCode])],
  controllers: [OhipController],
  providers: [OhipService],
  exports: [OhipService],
})
export class OhipModule {}
