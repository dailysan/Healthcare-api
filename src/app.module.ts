import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ClinicsModule } from './clinics/clinics.module';
import { PatientsModule } from './patients/patients.module';
import { BillingSessionsModule } from './billing-sessions/billing-sessions.module';
import { InvoicesModule } from './invoices/invoices.module';
import { OhipModule } from './ohip/ohip.module';
import { PricingRulesModule } from './pricing-rules/pricing-rules.module';
import { AuditLogModule } from './audit-log/audit-log.module';
import { CommonModule } from './common/common.module';
import { RolesModule } from './roles/roles.module';
import { RolesSeeder } from './roles/seed.roles';
import { ConfigsModule } from './configs/configs.module';
import { typeOrmConfig } from './configs/typeorm.config';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      ...typeOrmConfig,
      synchronize: true,
      logging: true
    }),
    MongooseModule.forRoot(process.env.MONGODB_URI || 'mongodb://localhost:27017/healthcare'),
    ConfigsModule,
    AuthModule, 
    AuditLogModule, 
    OhipModule, 
    PricingRulesModule, 
    PatientsModule, 
    ClinicsModule, 
    InvoicesModule, 
    BillingSessionsModule,
    RolesModule,
    CommonModule
  ],
  providers: [AppService],
  controllers: [AppController]
})
export class AppModule {}
