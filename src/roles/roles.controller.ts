import { Controller, Get, Post, Body, Param, Put, Delete, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RolesService } from './roles.service';
import { Role as RoleEntity } from './entities/role.entity';
import { UpdateRoleDto } from './dto/update-role.dto';
import { CreateRoleDto } from './dto/create-role.dto';
import { RoleUserDto } from './dto/role-user.dto';
import { ListRolesDto } from './dto/list-roles.dto';
import { Role as RoleDecorator } from '../common/decorators/role.decorator';
import { RoleEnum } from '../common/utils/role.enum';

@ApiTags('roles')
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get()
  @RoleDecorator(RoleEnum.ADMIN)
  @ApiOperation({ summary: 'List all roles with pagination' })
  @ApiResponse({ status: 200, description: 'List of roles' })
  async findAll(@Query() listRolesDto: ListRolesDto): Promise<{ roles: RoleEntity[]; total: number }> {
    const { roles, total } = await this.rolesService.findAll(listRolesDto);
    return { roles, total };
  }

  @Get(':id')
  @RoleDecorator(RoleEnum.ADMIN)
  @ApiOperation({ summary: 'Get role by ID' })
  @ApiResponse({ status: 200, description: 'Role found' })
  @ApiResponse({ status: 404, description: 'Role not found' })
  async findOne(@Param('id') id: string): Promise<RoleEntity> {
    return this.rolesService.findOne(+id);
  }

  @Post()
  @RoleDecorator(RoleEnum.ADMIN)
  @ApiOperation({ summary: 'Create a new role' })
  @ApiResponse({ status: 201, description: 'Role created successfully' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  async create(@Body() createRoleDto: CreateRoleDto): Promise<RoleEntity> {
    return this.rolesService.create(createRoleDto.name, createRoleDto.permissions);
  }

  @Put(':id')
  @RoleDecorator(RoleEnum.ADMIN)
  @ApiOperation({ summary: 'Update a role' })
  @ApiResponse({ status: 200, description: 'Role updated successfully' })
  @ApiResponse({ status: 404, description: 'Role not found' })
  @ApiResponse({ status: 400, description: 'Validation error' })
  async update(
    @Param('id') id: string,
    @Body() updateRoleDto: UpdateRoleDto
  ): Promise<RoleEntity> {
    return this.rolesService.update(+id, updateRoleDto);
  }

  @Delete(':id')
  @RoleDecorator(RoleEnum.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a role' })
  @ApiResponse({ status: 204, description: 'Role deleted successfully' })
  @ApiResponse({ status: 404, description: 'Role not found' })
  async remove(@Param('id') id: string): Promise<void> {
    await this.rolesService.remove(+id);
  }

  @Post('assign')
  @RoleDecorator(RoleEnum.ADMIN)
  @ApiOperation({ summary: 'Assign a role to a user' })
  @ApiResponse({ status: 201, description: 'Role assigned successfully' })
  @ApiResponse({ status: 404, description: 'User or role not found' })
  async addRoleToUser(@Body() roleUserDto: RoleUserDto): Promise<void> {
    await this.rolesService.addRoleToUser(roleUserDto.userId, roleUserDto.roleId);
  }

  @Delete('assign')
  @RoleDecorator(RoleEnum.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remove a role from a user' })
  @ApiResponse({ status: 204, description: 'Role removed successfully' })
  @ApiResponse({ status: 404, description: 'User or role not found' })
  async removeRoleFromUser(@Body() roleUserDto: RoleUserDto): Promise<void> {
    await this.rolesService.removeRoleFromUser(roleUserDto.userId, roleUserDto.roleId);
  }
}
