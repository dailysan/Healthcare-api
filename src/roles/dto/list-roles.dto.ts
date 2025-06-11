import { ApiProperty } from '@nestjs/swagger';

export class ListRolesDto {
  @ApiProperty({
    description: 'Número de página',
    required: false,
    default: 1,
  })
  page: number = 1;

  @ApiProperty({
    description: 'Número de elementos por página',
    required: false,
    default: 10,
  })
  limit: number = 10;

  @ApiProperty({
    description: 'Nombre del rol para filtrar',
    required: false,
  })
  name?: string;

  @ApiProperty({
    description: 'Permisos para filtrar',
    required: false,
    isArray: true,
  })
  permissions?: string[];
}
