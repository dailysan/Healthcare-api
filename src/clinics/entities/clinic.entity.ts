import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { PricingRule } from '../../pricing-rules/entities/pricing-rule.entity';

@Entity('clinics')
export class Clinic {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  address: string;

  @Column({ type: 'text', nullable: true })
  logo: string;

  @Column('jsonb', { nullable: true })
  settings: any;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => PricingRule, (pricingRule) => pricingRule.clinic)
  pricingRules: PricingRule[];
}
