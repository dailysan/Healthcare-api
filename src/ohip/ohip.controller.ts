import { Controller, Get, Post, Body, Param, Put, Delete, Query } from '@nestjs/common';
import { ApiSuccessResponse } from '../common/decorators/api-response.decorator';
import { OhipCode } from './entities/ohip-code.entity';
import { NotFoundException } from '@nestjs/common';
import { OhipService } from './ohip.service';
import { CreateOhipCodeDto } from './dto/create-ohip-code.dto';

@Controller('ohip')
export class OhipController {
  constructor(private readonly ohipService: OhipService) {}

  @Post()
  create(@Body() createOhipCodeDto: CreateOhipCodeDto) {
    return this.ohipService.create(createOhipCodeDto);
  }

  @Get()
  findAll() {
    return this.ohipService.findAll();
  }

  @Get(':id')
  @ApiSuccessResponse('Find one OHIP code by id', OhipCode)
  async findOne(@Param('id') id: string) {
    const ohipCode = await this.ohipService.findOne(+id);
    if (!ohipCode) {
      throw new NotFoundException(`OHIP code with id ${id} not found`);
    }
    return ohipCode;
  }

  @Get('code/:code')
  @ApiSuccessResponse('Find OHIP code by code', OhipCode)
  async findByCode(@Param('code') code: string) {
    const ohipCode = await this.ohipService.findByCode(code);
    if (!ohipCode) {
      throw new NotFoundException(`OHIP code ${code} not found`);
    }
    return ohipCode;
  }

  @Get('active')
  @ApiSuccessResponse('Find all active OHIP codes', OhipCode, true)
  async findByActive() {
    const activeCodes = await this.ohipService.findByActive();
    if (!activeCodes || activeCodes.length === 0) {
      throw new NotFoundException('No active OHIP codes found');
    }
    return activeCodes;
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateOhipCodeDto: Partial<CreateOhipCodeDto>) {
    return this.ohipService.update(+id, updateOhipCodeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ohipService.remove(+id);
  }

  @Get('validate/price/:code')
  validatePrice(
    @Param('code') code: string,
    @Body('price') price: number,
  ) {
    return this.ohipService.validatePrice(code, price);
  }
}