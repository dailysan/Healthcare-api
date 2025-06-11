import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Clinic } from '../clinics/entities/clinic.entity';
import { OhipCode } from '../ohip/ohip-code.entity';

@Entity('pricing_rules')
export class PricingRule {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  percentage: number;

  @ManyToOne(() => Clinic, clinic => clinic.pricingRules)
  clinic: Clinic;

  @Column()
  clinicId: number;

  @ManyToOne(() => OhipCode, ohipCode => ohipCode.pricingRules)
  ohipCode: OhipCode;

  @Column()
  ohipCodeId: string;
}
