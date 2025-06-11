import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvoicesController } from './invoices.controller';
import { InvoicesService } from './invoices.service';
import { Invoice } from './entities/invoice.entity';
import { BillingSessionsModule } from '../billing-sessions/billing-sessions.module';
import { AuditLogModule } from '../audit-log/audit-log.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Invoice]),
    BillingSessionsModule,
    AuditLogModule
  ],
  controllers: [InvoicesController],
  providers: [
    InvoicesService,
    Invoice
  ],
  exports: [
    InvoicesService,
    Invoice
  ],
})
export class InvoicesModule {}
