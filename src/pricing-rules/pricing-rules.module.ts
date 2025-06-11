import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PricingRulesController } from './pricing-rules.controller';
import { PricingRulesService } from './pricing-rules.service';
import { PricingRule } from './pricing-rule.entity';
import { OhipModule } from '../ohip/ohip.module';
import { ClinicsModule } from '../clinics/clinics.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PricingRule]),
    OhipModule,
    ClinicsModule,
  ],
  controllers: [PricingRulesController],
  providers: [PricingRulesService],
  exports: [PricingRulesService],
})
export class PricingRulesModule {}
