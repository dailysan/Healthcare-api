import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { ApiSuccessResponse } from '../common/decorators/api-response.decorator';
import { PatientsService } from './patients.service';
import { CreatePatientDto } from './dto/create-patient.dto';
import { Patient } from './entities/patient.entity';

@Controller('patients')
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @Post()
  @ApiSuccessResponse('Create a new patient', Patient)
  create(@Body() createPatientDto: CreatePatientDto) {
    return this.patientsService.create(createPatientDto);
  }

  @Get()
  @ApiSuccessResponse('Find all patients', Patient, true)
  findAll() {
    return this.patientsService.findAll();
  }

  @Get(':id')
  @ApiSuccessResponse('Find one patient by id', Patient)
  findOne(@Param('id') id: string) {
    return this.patientsService.findOne(+id);
  }

  @Get('email/:email')
  @ApiSuccessResponse('Find patient by email', Patient)
  findByEmail(@Param('email') email: string) {
    return this.patientsService.findByEmail(email);
  }

  @Put(':id')
  @ApiSuccessResponse('Update a patient', Patient)
  update(@Param('id') id: string, @Body() updatePatientDto: Partial<CreatePatientDto>) {
    return this.patientsService.update(+id, updatePatientDto);
  }

  @Delete(':id')
  @ApiSuccessResponse('Delete a patient')
  remove(@Param('id') id: string) {
    return this.patientsService.remove(+id);
  }
}