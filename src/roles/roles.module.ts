import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';
import { Role } from './entities/role.entity';
import { User } from '../common/entities/user.entity';
import { RoleGuard } from '../common/guards/role.guard';
import { RolesSeeder } from './seed.roles';

@Module({
  imports: [
    TypeOrmModule.forFeature([Role, User])
  ],
  controllers: [RolesController],
  providers: [
    RolesService,
    RoleGuard,
    RolesSeeder
  ],
  exports: [
    RolesService,
    RoleGuard
  ]
})
export class RolesModule {}
