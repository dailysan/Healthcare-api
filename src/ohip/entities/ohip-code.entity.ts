import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { PricingRule } from '../../pricing-rules/entities/pricing-rule.entity';

@Entity('ohip_codes')
export class OhipCode {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('varchar', { length: 10 })
  code: string;

  @Column('varchar', { length: 255 })
  description: string;

  @Column('decimal', { precision: 10, scale: 2 })
  basePrice: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  maxPrice: number;

  @Column('boolean', { default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => PricingRule, (pricingRule) => pricingRule.ohipCode)
  pricingRules: PricingRule[];
}
