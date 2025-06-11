import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuditLogRepository } from './audit-log.repository';
import { AuditLog } from './entities/audit-log.entity';
import { Between } from 'typeorm';

@Injectable()
export class AuditLogService {
  constructor(
    @InjectRepository(AuditLogRepository)
    private auditLogsRepository: AuditLogRepository,
  ) {}

  async log(
    action: string,
    module: string,
    entityId: string,
    data: any,
    userId: string,
    ipAddress: string,
  ): Promise<AuditLog> {
    try {
      const auditLog = this.auditLogsRepository.create({
        action,
        module: module.toLowerCase(),
        entityId,
        data,
        resource: module.toLowerCase(),
        resourceId: entityId,
        userId,
        ipAddress,
      });

      return await this.auditLogsRepository.save(auditLog);
    } catch (error) {
      console.error('Error creating audit log:', error);
      throw error;
    }
  }

  async findAll(): Promise<AuditLog[]> {
    return this.auditLogsRepository.find();
  }

  async findByModule(module: string): Promise<AuditLog[]> {
    try {
      return this.auditLogsRepository.findByModule(module);
    } catch (error) {
      console.error('Error finding audit logs by module:', error);
      throw error;
    }
  }

  async findByAction(action: string): Promise<AuditLog[]> {
    return this.auditLogsRepository.find({ where: { action } });
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<AuditLog[]> {
    return this.auditLogsRepository.find({
      where: {
        createdAt: Between(startDate, endDate),
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async findByUser(userId: string): Promise<AuditLog[]> {
    return this.auditLogsRepository.find({ where: { userId } });
  }
}