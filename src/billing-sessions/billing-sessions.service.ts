import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BillingSession } from './entities/billing-session.entity';
import { CreateBillingSessionDto } from './dto/create-billing-session.dto';
import { AuditLogService } from '../audit-log/audit-log.service';

@Injectable()
export class BillingSessionsService {
  constructor(
    @InjectRepository(BillingSession)
    private readonly billingSessionsRepository: Repository<BillingSession>,
    private readonly auditLogService: AuditLogService,
  ) {}

  async create(createBillingSessionDto: CreateBillingSessionDto): Promise<BillingSession> {
    if (!createBillingSessionDto.patientId || !createBillingSessionDto.clinicId || 
        !createBillingSessionDto.services || !createBillingSessionDto.total) {
      throw new BadRequestException('Todos los campos requeridos deben estar presentes');
    }

    if (typeof createBillingSessionDto.total !== 'number' || createBillingSessionDto.total <= 0) {
      throw new BadRequestException('El total debe ser un número positivo');
    }

    if (!Array.isArray(createBillingSessionDto.services) || createBillingSessionDto.services.length === 0) {
      throw new BadRequestException('Debe haber al menos un servicio');
    }

    const session = this.billingSessionsRepository.create(createBillingSessionDto);
    const savedSession = await this.billingSessionsRepository.save(session);

    await this.auditLogService.log(
      'create',
      'billing-sessions',
      savedSession.id.toString(),
      savedSession,
      'system',
      '127.0.0.1'
    );

    if (!savedSession.id) {
      throw new Error('Failed to create billing session');
    }

    return savedSession;
  }

  findAll(): Promise<BillingSession[]> {
    return this.billingSessionsRepository.find();
  }

  async findOne(id: number): Promise<BillingSession> {
    const session = await this.billingSessionsRepository.findOne({ where: { id } });
    if (!session) {
      throw new NotFoundException(`Billing session with id ${id} not found`);
    }
    return session;
  }

  async findByPatient(patientId: number): Promise<BillingSession[]> {
    const sessions = await this.billingSessionsRepository.createQueryBuilder('billingSession')
      .where('billingSession.patientId = :patientId', { patientId })
      .getMany();
    
    if (sessions.length === 0) {
      throw new NotFoundException(`No billing sessions found for patient ${patientId}`);
    }
    return sessions;
  }

  async findByClinic(clinicId: number): Promise<BillingSession[]> {
    const sessions = await this.billingSessionsRepository.createQueryBuilder('billingSession')
      .where('billingSession.clinicId = :clinicId', { clinicId })
      .getMany();
    
    if (sessions.length === 0) {
      throw new NotFoundException(`No billing sessions found for clinic ${clinicId}`);
    }
    return sessions;
  }

  async update(id: number, updateBillingSessionDto: Partial<CreateBillingSessionDto>): Promise<BillingSession> {
    if (!id || id <= 0) {
      throw new Error('Invalid billing session ID');
    }

    const session = await this.findOne(id);
    if (!session) {
      throw new NotFoundException(`Billing session with id ${id} not found`);
    }

    if (updateBillingSessionDto.total !== undefined && updateBillingSessionDto.total <= 0) {
      throw new Error('Total must be greater than zero');
    }

    if (updateBillingSessionDto.services !== undefined) {
      if (!Array.isArray(updateBillingSessionDto.services) || 
          updateBillingSessionDto.services.length === 0) {
        throw new Error('At least one service is required');
      }
    }

    await this.billingSessionsRepository.update(id, updateBillingSessionDto);
    const updatedSession = await this.findOne(id);
    
    if (!updatedSession) {
      throw new Error('Failed to update billing session');
    }

    await this.auditLogService.log(
      'UPDATE',
      'BILLING_SESSIONS',
      id.toString(),
      { old: session, new: updatedSession },
      'system',
      '127.0.0.1'
    );

    return updatedSession;
  }

  async remove(id: number): Promise<void> {
    if (!id || id <= 0) {
      throw new Error('Invalid billing session ID');
    }

    const session = await this.findOne(id);
    if (!session) {
      throw new NotFoundException(`Billing session with id ${id} not found`);
    }

    await this.auditLogService.log(
      'DELETE',
      'BILLING_SESSIONS',
      id.toString(),
      { session },
      'system',
      '127.0.0.1'
    );

    const result = await this.billingSessionsRepository.delete(id);
    
    if (result.affected === 0) {
      throw new Error('Failed to delete billing session');
    }
  }
}