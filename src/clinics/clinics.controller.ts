import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { ApiSuccessResponse } from '../common/decorators/api-response.decorator';
import { ClinicsService } from './clinics.service';
import { CreateClinicDto } from './dto/create-clinic.dto';
import { UpdateClinicDto } from './dto/update-clinic.dto';
import { Clinic } from './entities/clinic.entity';

@Controller('clinics')
export class ClinicsController {
  constructor(private readonly clinicsService: ClinicsService) {}

  @Post()
  @ApiSuccessResponse('Create a new clinic', Clinic)
  create(@Body() createClinicDto: CreateClinicDto) {
    return this.clinicsService.create(createClinicDto);
  }

  @Get()
  @ApiSuccessResponse('Find all clinics', Clinic, true)
  findAll() {
    return this.clinicsService.findAll();
  }

  @Get(':id')
  @ApiSuccessResponse('Find one clinic by id', Clinic)
  findOne(@Param('id') id: string) {
    return this.clinicsService.findOne(+id);
  }

  @Put(':id')
  @ApiSuccessResponse('Update a clinic', Clinic)
  update(@Param('id') id: string, @Body() updateClinicDto: UpdateClinicDto) {
    return this.clinicsService.update(+id, updateClinicDto);
  }

  @Delete(':id')
  @ApiSuccessResponse('Delete a clinic')
  remove(@Param('id') id: string) {
    return this.clinicsService.remove(+id);
  }
}