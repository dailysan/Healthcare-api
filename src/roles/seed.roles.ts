import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './entities/role.entity';
import { Logger } from '@nestjs/common';
import { RoleEnum } from '../common/utils/role.enum';
import { PermissionEnum } from '../common/utils/permission.enum';

@Injectable()
export class RolesSeeder implements OnModuleInit {
  private readonly logger = new Logger(RolesSeeder.name);

  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async onModuleInit() {
    await this.seed();
  }

  private async seed() {
    const roles = [
      {
        name: RoleEnum.ADMIN,
        permissions: Object.values(PermissionEnum),
      },
      {
        name: RoleEnum.DOCTOR,
        permissions: [
          PermissionEnum.PATIENTS_READ,
          PermissionEnum.PATIENTS_WRITE,
          PermissionEnum.CLINICS_READ,
        ],
      },
      {
        name: RoleEnum.RECEPTIONIST,
        permissions: [
          PermissionEnum.INVOICES_READ,
          PermissionEnum.INVOICES_WRITE,
          PermissionEnum.PATIENTS_READ,
          PermissionEnum.PATIENTS_WRITE,
          PermissionEnum.CLINICS_READ,
        ],
      },
    ];

    for (const roleData of roles) {
      try {
        const existingRole = await this.roleRepository.findOne({
          where: { name: roleData.name },
        });

        if (!existingRole) {
          const newRole = this.roleRepository.create({
            name: roleData.name,
            permissions: roleData.permissions,
          });
          await this.roleRepository.save(newRole);
          this.logger.log(`Created role: ${roleData.name}`);
        } else {
          existingRole.permissions = roleData.permissions;
          await this.roleRepository.save(existingRole);
          this.logger.log(`Updated role: ${roleData.name}`);
        }
      } catch (error) {
        this.logger.error(`Error seeding role ${roleData.name}: ${error.message}`);
      }
    }
  }
}
