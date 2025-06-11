import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './entities/role.entity';
import { User } from '../common/entities/user.entity';
import { RoleEnum } from '../common/utils/role.enum';
import { ListRolesDto } from './dto/list-roles.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private readonly rolesRepository: Repository<Role>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>
  ) {}

  async create(name: string, permissions: string[]): Promise<Role> {
    const role = this.rolesRepository.create({ name, permissions });
    return this.rolesRepository.save(role);
  }

  async findAll(listRolesDto: ListRolesDto): Promise<{ roles: Role[]; total: number }> {
    const queryBuilder = this.rolesRepository.createQueryBuilder('role')
      .leftJoinAndSelect('role.users', 'users')
      .skip((listRolesDto.page - 1) * listRolesDto.limit)
      .take(listRolesDto.limit);

    if (listRolesDto.name) {
      queryBuilder.where('role.name ILIKE :name', { name: `%${listRolesDto.name}%` });
    }

    if (listRolesDto.permissions?.length) {
      queryBuilder.andWhere('role.permissions && :permissions', { permissions: listRolesDto.permissions });
    }

    const [roles, total] = await queryBuilder.getManyAndCount();
    return { roles, total };
  }

  async findOne(id: number): Promise<Role> {
    const role = await this.rolesRepository.findOne({
      where: { id },
      relations: ['users'],
    });

    if (!role) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }

    return role;
  }

  async findOneByName(name: string): Promise<Role> {
    const role = await this.rolesRepository.findOne({
      where: { name },
      relations: ['users'],
    });

    if (!role) {
      throw new NotFoundException(`Role with name ${name} not found`);
    }

    return role;
  }

  async addRoleToUser(userId: number, roleId: number): Promise<void> {
    const user = await this.usersRepository.findOne({
      where: { id: userId }
    });
    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }

    const role = await this.rolesRepository.findOne({
      where: { id: roleId }
    });
    if (!role) {
      throw new NotFoundException(`Role with id ${roleId} not found`);
    }

    await this.usersRepository.save({
      id: userId,
      roles: [...(user.roles ?? []), role]
    });
  }

  async removeRoleFromUser(userId: number, roleId: number): Promise<void> {
    const user = await this.usersRepository.findOne({
      where: { id: userId }
    });
    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }

    const role = await this.rolesRepository.findOne({
      where: { id: roleId }
    });
    if (!role) {
      throw new NotFoundException(`Role with id ${roleId} not found`);
    }

    if (!user.roles?.some(r => r.id === role.id)) {
      throw new BadRequestException(`User does not have role ${role.name}`);
    }

    await this.usersRepository.save({
      id: userId,
      roles: user.roles.filter(r => r.id !== role.id)
    });
  }

  async update(id: number, updateRoleDto: UpdateRoleDto): Promise<Role> {
    const role = await this.rolesRepository.findOne({
      where: { id },
    });

    if (!role) {
      throw new NotFoundException('Role not found');
    }

    if (updateRoleDto.name) role.name = updateRoleDto.name;
    if (updateRoleDto.permissions) role.permissions = updateRoleDto.permissions;

    return this.rolesRepository.save(role);
  }

  async remove(id: number): Promise<void> {
    const role = await this.rolesRepository.findOne({
      where: { id },
    });

    if (!role) {
      throw new NotFoundException('Role not found');
    }

    await this.rolesRepository.delete(id);
  }
}
