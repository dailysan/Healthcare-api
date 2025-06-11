import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { ApiSuccessResponse } from '../common/decorators/api-response.decorator';
import { InvoicesService } from './invoices.service';
import { GenerateInvoiceDto } from './dto/generate-invoice.dto';
import { Invoice } from './entities/invoice.entity';

@Controller('invoices')
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @Post()
  @ApiSuccessResponse('Generate a new invoice', Invoice)
  generateInvoice(@Body() generateInvoiceDto: GenerateInvoiceDto) {
    return this.invoicesService.generateInvoice(generateInvoiceDto);
  }

  @Get()
  @ApiSuccessResponse('Find all invoices', Invoice, true)
  findAll() {
    return this.invoicesService.findAll();
  }

  @Get(':id')
  @ApiSuccessResponse('Find one invoice by id', Invoice)
  findOne(@Param('id') id: string) {
    return this.invoicesService.findOne(+id);
  }

  @Get('billing-session/:billingSessionId')
  @ApiSuccessResponse('Find invoices by billing session', Invoice, true)
  findByBillingSession(@Param('billingSessionId') billingSessionId: string) {
    return this.invoicesService.findByBillingSession(+billingSessionId);
  }

  @Put(':id')
  @ApiSuccessResponse('Update an invoice', Invoice)
  update(@Param('id') id: string, @Body() updateInvoiceDto: Partial<GenerateInvoiceDto>) {
    return this.invoicesService.update(+id, updateInvoiceDto);
  }

  @Delete(':id')
  @ApiSuccessResponse('Delete an invoice')
  remove(@Param('id') id: string) {
    return this.invoicesService.remove(+id);
  }
}