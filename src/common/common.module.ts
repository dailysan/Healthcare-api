import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UsersModule } from './utils/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    UsersModule
  ],
  exports: [
    TypeOrmModule,
    UsersModule
  ],
})
export class CommonModule {}
