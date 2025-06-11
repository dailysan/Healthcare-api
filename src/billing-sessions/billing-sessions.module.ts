import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BillingSessionsController } from './billing-sessions.controller';
import { BillingSessionsService } from './billing-sessions.service';
import { BillingSession } from './billing-session.entity';
import { AuditLogModule } from '../audit-log/audit-log.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([BillingSession]),
    AuditLogModule
  ],
  controllers: [BillingSessionsController],
  providers: [BillingSessionsService],
  exports: [BillingSessionsService],
})
export class BillingSessionsModule {}
