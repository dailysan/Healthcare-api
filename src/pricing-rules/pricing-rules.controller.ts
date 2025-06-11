import { Controller, Get, Post, Body, Param, Put, Delete, Query } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common';
import { ApiSuccessResponse } from '../common/decorators/api-response.decorator';
import { PricingRulesService } from './pricing-rules.service';
import { CreatePricingRuleDto } from './dto/create-pricing-rule.dto';
import { PricingRule } from './entities/pricing-rule.entity';

@Controller('pricing-rules')
export class PricingRulesController {
  constructor(private readonly pricingRulesService: PricingRulesService) {}

  @Post()
  @ApiSuccessResponse('Create a new pricing rule', PricingRule)
  create(@Body() createPricingRuleDto: CreatePricingRuleDto) {
    return this.pricingRulesService.create(createPricingRuleDto);
  }

  @Get()
  @ApiSuccessResponse('Find all pricing rules', PricingRule, true)
  findAll() {
    return this.pricingRulesService.findAll();
  }

  @Get(':id')
  @ApiSuccessResponse('Find one pricing rule by id', PricingRule)
  async findOne(@Param('id') id: string) {
    const rule = await this.pricingRulesService.findOne(+id);
    if (!rule) {
      throw new NotFoundException(`Pricing rule with id ${id} not found`);
    }
    return rule;
  }

  @Get('clinic/:clinicId')
  @ApiSuccessResponse('Find pricing rules by clinic', PricingRule, true)
  findByClinic(@Param('clinicId') clinicId: string) {
    return this.pricingRulesService.findByClinic(+clinicId);
  }

  @Get('ohip/:ohipCodeId')
  @ApiSuccessResponse('Find pricing rule by OHIP code', PricingRule)
  findByOhipCodeId(@Param('ohipCodeId') ohipCodeId: string) {
    return this.pricingRulesService.findByOhipCodeId(ohipCodeId);
  }

  @Get('calculate')
  @ApiSuccessResponse('Calculate price based on clinic and OHIP code')
  calculatePrice(
    @Query('clinicId') clinicId: number,
    @Query('ohipCodeId') ohipCodeId: string,
  ) {
    return this.pricingRulesService.calculatePrice(clinicId, ohipCodeId);
  }

  @Put(':id')
  @ApiSuccessResponse('Update a pricing rule', PricingRule)
  update(@Param('id') id: string, @Body() updatePricingRuleDto: Partial<CreatePricingRuleDto>) {
    return this.pricingRulesService.update(+id, updatePricingRuleDto);
  }

  @Delete(':id')
  @ApiSuccessResponse('Delete a pricing rule')
  remove(@Param('id') id: string) {
    return this.pricingRulesService.remove(+id);
  }
}