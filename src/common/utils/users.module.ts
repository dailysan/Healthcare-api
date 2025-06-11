import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { ConfigsModule } from '../../configs/configs.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    ConfigsModule
  ],
  providers: [UsersService],
  exports: [UsersService]
})
export class UsersModule {}
