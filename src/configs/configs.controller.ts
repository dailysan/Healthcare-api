import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { ApiSuccessResponse } from '../common/decorators/api-response.decorator';
import { ConfigsService } from './configs.service';
import { Config } from './entities/config.entity';

@Controller('configs')
export class ConfigsController {
  constructor(private readonly configsService: ConfigsService) {}

  @Post()
  @ApiSuccessResponse('Create a new config', Config)
  create(@Body() createConfigDto: any) {
    return this.configsService.create(createConfigDto);
  }

  @Get()
  @ApiSuccessResponse('Find all configs', Config, true)
  findAll() {
    return this.configsService.findAll();
  }

  @Get(':key')
  @ApiSuccessResponse('Find config by key', Config)
  findOne(@Param('key') key: string) {
    return this.configsService.findOne(key);
  }

  @Put(':key')
  @ApiSuccessResponse('Update config', Config)
  update(@Param('key') key: string, @Body() updateConfigDto: any) {
    return this.configsService.update(key, updateConfigDto);
  }

  @Delete(':key')
  @ApiSuccessResponse('Delete config')
  remove(@Param('key') key: string) {
    return this.configsService.remove(key);
  }
}
