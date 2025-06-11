import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { ApiSuccessResponse } from '../common/decorators/api-response.decorator';
import { BillingSessionsService } from './billing-sessions.service';
import { CreateBillingSessionDto } from './dto/create-billing-session.dto';
import { BillingSession } from './entities/billing-session.entity';

@Controller('billing-sessions')
export class BillingSessionsController {
  constructor(private readonly billingSessionsService: BillingSessionsService) {}

  @Post()
  @ApiSuccessResponse('Create a new billing session', BillingSession)
  create(@Body() createBillingSessionDto: CreateBillingSessionDto) {
    return this.billingSessionsService.create(createBillingSessionDto);
  }

  @Get()
  @ApiSuccessResponse('Find all billing sessions', BillingSession, true)
  findAll() {
    return this.billingSessionsService.findAll();
  }

  @Get(':id')
  @ApiSuccessResponse('Find one billing session by id', BillingSession)
  findOne(@Param('id') id: string) {
    return this.billingSessionsService.findOne(+id);
  }

  @Get('patient/:patientId')
  @ApiSuccessResponse('Find billing sessions by patient', BillingSession, true)
  findByPatient(@Param('patientId') patientId: string) {
    return this.billingSessionsService.findByPatient(+patientId);
  }

  @Get('clinic/:clinicId')
  @ApiSuccessResponse('Find billing sessions by clinic', BillingSession, true)
  findByClinic(@Param('clinicId') clinicId: string) {
    return this.billingSessionsService.findByClinic(+clinicId);
  }

  @Put(':id')
  @ApiSuccessResponse('Update a billing session', BillingSession)
  update(@Param('id') id: string, @Body() updateBillingSessionDto: Partial<CreateBillingSessionDto>) {
    return this.billingSessionsService.update(+id, updateBillingSessionDto);
  }

  @Delete(':id')
  @ApiSuccessResponse('Delete a billing session')
  remove(@Param('id') id: string) {
    return this.billingSessionsService.remove(+id);
  }
}