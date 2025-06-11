import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { PricingRule } from '../pricing-rules/pricing-rule.entity';

@Entity('ohip_codes')
export class OhipCode {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  code: string;

  @Column()
  description: string;

  @Column()
  basePrice: number;

  @Column({ nullable: true })
  maxPrice: number;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @ManyToOne(() => PricingRule, pricingRule => pricingRule.ohipCode)
  pricingRules: PricingRule[];
}
