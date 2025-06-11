import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Invoice } from './entities/invoice.entity';
import { GenerateInvoiceDto } from './dto/generate-invoice.dto';
import { BillingSessionsService } from '../billing-sessions/billing-sessions.service';
import { AuditLogService } from '../audit-log/audit-log.service';

@Injectable()
export class InvoicesService {
  constructor(
    @InjectRepository(Invoice)
    private readonly invoicesRepository: Repository<Invoice>,
    private readonly billingSessionsService: BillingSessionsService,
    private readonly auditLogService: AuditLogService,
  ) {}

  async findByPatientId(patientId: number): Promise<Invoice[]> {
    return this.invoicesRepository.find({
      where: { patient: { id: patientId } }
    });
  }

  async generateInvoice(generateInvoiceDto: GenerateInvoiceDto): Promise<Invoice> {
    if (!generateInvoiceDto.billingSessionId || 
        generateInvoiceDto.basePrice === undefined || 
        generateInvoiceDto.reason === undefined) {
      throw new Error('Billing session ID, base price and reason are required');
    }

    if (generateInvoiceDto.basePrice <= 0) {
      throw new Error('Base price must be greater than zero');
    }

    if (generateInvoiceDto.discount !== undefined && 
        (generateInvoiceDto.discount < 0 || generateInvoiceDto.discount > generateInvoiceDto.basePrice)) {
      throw new Error('Discount must be between 0 and base price');
    }

    const billingSession = await this.billingSessionsService.findOne(generateInvoiceDto.billingSessionId);
    if (!billingSession) {
      throw new NotFoundException(`Billing session with id ${generateInvoiceDto.billingSessionId} not found`);
    }

    if (billingSession.total <= 0) {
      throw new Error('Billing session total must be greater than zero');
    }

    if (generateInvoiceDto.basePrice > billingSession.total) {
      throw new Error('Base price cannot exceed billing session total');
    }

    const invoice = this.invoicesRepository.create({
      billingSession: {
        id: generateInvoiceDto.billingSessionId
      },
      basePrice: generateInvoiceDto.basePrice,
      finalPrice: generateInvoiceDto.discount 
        ? generateInvoiceDto.basePrice - generateInvoiceDto.discount
        : generateInvoiceDto.basePrice,
      reason: generateInvoiceDto.reason,
      discount: generateInvoiceDto.discount || 0,
    });

    const savedInvoice = await this.invoicesRepository.save(invoice);
    
    if (!savedInvoice.id) {
      throw new Error('Failed to create invoice');
    }

    await this.auditLogService.log(
      'CREATE',
      'INVOICES',
      savedInvoice.id.toString(),
      { invoice, billingSession },
      'system',
      '127.0.0.1' 
    );

    return savedInvoice;
  }

  async findAll(): Promise<Invoice[]> {
    return this.invoicesRepository.find();
  }

  async findOne(id: number): Promise<Invoice> {
    const invoice = await this.invoicesRepository.findOneBy({ id });
    if (!invoice) {
      throw new NotFoundException(`Invoice with id ${id} not found`);
    }
    return invoice;
  }

  async findByBillingSession(billingSessionId: number): Promise<Invoice[]> {
    return this.invoicesRepository.find({ where: { billingSession: { id: billingSessionId } } });
  }

  async update(id: number, updateInvoiceDto: Partial<GenerateInvoiceDto>): Promise<Invoice> {
    if (!id || id <= 0) {
      throw new Error('Invalid invoice ID');
    }

    const invoice = await this.findOne(id);
    if (!invoice) {
      throw new NotFoundException(`Invoice with id ${id} not found`);
    }

    if (updateInvoiceDto.basePrice !== undefined) {
      if (updateInvoiceDto.basePrice <= 0) {
        throw new Error('Base price must be greater than zero');
      }

      if (updateInvoiceDto.discount !== undefined && 
          (updateInvoiceDto.discount < 0 || updateInvoiceDto.discount > updateInvoiceDto.basePrice)) {
        throw new Error('Discount must be between 0 and base price');
      }

      const billingSession = await this.billingSessionsService.findOne(invoice.billingSession.id);
      if (updateInvoiceDto.basePrice > billingSession.total) {
        throw new Error('Base price cannot exceed billing session total');
      }

      invoice.basePrice = updateInvoiceDto.basePrice;
      invoice.finalPrice = updateInvoiceDto.discount 
        ? updateInvoiceDto.basePrice - updateInvoiceDto.discount
        : updateInvoiceDto.basePrice;
    }

    if (updateInvoiceDto.reason !== undefined && !updateInvoiceDto.reason.trim()) {
      throw new Error('Reason cannot be empty');
    }

    await this.invoicesRepository.update(id, invoice);
    const updatedInvoice = await this.findOne(id);
    
    if (!updatedInvoice) {
      throw new Error('Failed to update invoice');
    }

    await this.auditLogService.log(
      'UPDATE',
      'INVOICES',
      id.toString(),
      { old: invoice, new: updatedInvoice },
      'system',
      '127.0.0.1'
    );

    return updatedInvoice;
  }

  async remove(id: number): Promise<void> {
    if (!id || id <= 0) {
      throw new Error('Invalid invoice ID');
    }

    const invoice = await this.findOne(id);
    if (!invoice) {
      throw new NotFoundException(`Invoice with id ${id} not found`);
    }

    await this.auditLogService.log(
      'DELETE',
      'INVOICES',
      id.toString(),
      { invoice },
      'system',
      '127.0.0.1'
    );

    const result = await this.invoicesRepository.delete(id);
    
    if (result.affected === 0) {
      throw new Error('Failed to delete invoice');
    }
  }
}