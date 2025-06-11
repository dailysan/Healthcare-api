import { Repository } from 'typeorm';
import { AuditLog } from './entities/audit-log.entity';

export class AuditLogRepository extends Repository<AuditLog> {
  async findByModule(module: string): Promise<AuditLog[]> {
    return this.createQueryBuilder('auditLog')
      .where('auditLog.module = :module', { module: module.toLowerCase() })
      .getMany();
  }
}
