import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PricingRule } from './pricing-rule.entity';
import { CreatePricingRuleDto } from './dto/create-pricing-rule.dto';
import { OhipService } from '../ohip/ohip.service';
import { ClinicsService } from '../clinics/clinics.service';

@Injectable()
export class PricingRulesService {
  constructor(
    @InjectRepository(PricingRule)
    private readonly pricingRulesRepository: Repository<PricingRule>,
    private readonly ohipService: OhipService,
    private readonly clinicsService: ClinicsService,
  ) {}

  async create(createPricingRuleDto: CreatePricingRuleDto): Promise<PricingRule> {
    const { percentage, clinicId, ohipCodeId } = createPricingRuleDto;
    
    if (percentage <= 0 || percentage > 100) {
      throw new Error('Percentage must be between 0 and 100');
    }

    const clinic = await this.clinicsService.findOne(clinicId);
    if (!clinic) {
      throw new NotFoundException(`Clinic with id ${clinicId} not found`);
    }

    const ohipCode = await this.ohipService.findByCode(ohipCodeId);
    if (!ohipCode) {
      throw new NotFoundException(`OHIP code ${ohipCodeId} not found`);
    }

    const existingRule = await this.pricingRulesRepository.findOne({
      where: {
        clinicId,
        ohipCodeId,
      },
    });

    if (existingRule) {
      throw new NotFoundException(`Pricing rule already exists for clinic ${clinicId} and OHIP code ${ohipCodeId}`);
    }

    const pricingRule = this.pricingRulesRepository.create({
      ...createPricingRuleDto,
      clinic,
      ohipCode
    });
    
    const savedRule = await this.pricingRulesRepository.save(pricingRule);
    
    if (!savedRule.id) {
      throw new Error('Failed to create pricing rule');
    }

    return savedRule;
  }

  async findAll(): Promise<PricingRule[]> {
    return this.pricingRulesRepository.find();
  }

  async findOne(id: number): Promise<PricingRule> {
    const rule = await this.pricingRulesRepository.findOneBy({ id });
    if (!rule) {
      throw new NotFoundException(`Pricing rule with id ${id} not found`);
    }
    return rule;
  }

  async findByClinic(clinicId: number): Promise<PricingRule[]> {
    const clinic = await this.clinicsService.findOne(clinicId);
    if (!clinic) {
      throw new NotFoundException(`Clinic with id ${clinicId} not found`);
    }

    const rules = await this.pricingRulesRepository.find({ where: { clinicId } });
    if (!rules || rules.length === 0) {
      throw new NotFoundException(`No pricing rules found for clinic ${clinicId}`);
    }
    return rules;
  }

  async findByOhipCodeId(ohipCodeId: string): Promise<PricingRule> {
    const ohipCode = await this.ohipService.findByCode(ohipCodeId);
    if (!ohipCode) {
      throw new NotFoundException(`OHIP code ${ohipCodeId} not found`);
    }

    const rule = await this.pricingRulesRepository.findOneBy({ ohipCodeId });
    if (!rule) {
      throw new NotFoundException(`Pricing rule with OHIP code ${ohipCodeId} not found`);
    }
    return rule;
  }

  async calculatePrice(clinicId: number, ohipCodeId: string): Promise<number> {
    if (!clinicId || clinicId <= 0) {
      throw new Error('Invalid clinic ID');
    }
    if (!ohipCodeId || typeof ohipCodeId !== 'string' || ohipCodeId.length === 0) {
      throw new Error('Invalid OHIP code');
    }

    const clinic = await this.clinicsService.findOne(clinicId);
    if (!clinic) {
      throw new NotFoundException(`Clinic with id ${clinicId} not found`);
    }

    const ohipCode = await this.ohipService.findByCode(ohipCodeId);
    if (!ohipCode) {
      throw new NotFoundException(`OHIP code ${ohipCodeId} not found`);
    }

    if (!ohipCode.isActive) {
      throw new NotFoundException(`OHIP code ${ohipCodeId} is not active`);
    }

    if (ohipCode.basePrice <= 0) {
      throw new Error('Invalid base price for OHIP code');
    }

    const pricingRule = await this.pricingRulesRepository.findOne({
      where: {
        clinicId,
        ohipCodeId,
      },
    });

    if (!pricingRule) {
      throw new NotFoundException(`No pricing rule found for clinic ${clinicId} and OHIP code ${ohipCodeId}`);
    }

    if (pricingRule.percentage <= 0 || pricingRule.percentage > 100) {
      throw new Error('Invalid percentage in pricing rule');
    }

    const finalPrice = ohipCode.basePrice * (1 + pricingRule.percentage / 100);
    
    if (ohipCode.maxPrice && finalPrice > ohipCode.maxPrice) {
      return ohipCode.maxPrice;
    }

    if (finalPrice <= 0) {
      throw new Error('Calculated price cannot be zero or negative');
    }

    return finalPrice;
  }

  async update(id: number, updatePricingRuleDto: Partial<CreatePricingRuleDto>): Promise<PricingRule> {
    const existingRule = await this.findOne(id);
    if (!existingRule) {
      throw new NotFoundException(`Pricing rule with id ${id} not found`);
    }

    const { percentage, clinicId, ohipCodeId } = updatePricingRuleDto;

    if (percentage !== undefined && (percentage <= 0 || percentage > 100)) {
      throw new Error('Percentage must be between 0 and 100');
    }

    if (clinicId !== undefined) {
      const clinic = await this.clinicsService.findOne(clinicId);
      if (!clinic) {
        throw new NotFoundException(`Clinic with id ${clinicId} not found`);
      }
    }

    if (ohipCodeId !== undefined) {
      const ohipCode = await this.ohipService.findByCode(ohipCodeId);
      if (!ohipCode) {
        throw new NotFoundException(`OHIP code ${ohipCodeId} not found`);
      }
    }

    await this.pricingRulesRepository.update(id, updatePricingRuleDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const existingRule = await this.findOne(id);
    if (!existingRule) {
      throw new NotFoundException(`Pricing rule with id ${id} not found`);
    }

    await this.pricingRulesRepository.delete(id);
  }
}