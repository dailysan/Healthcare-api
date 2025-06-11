import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Clinic } from '../../clinics/entities/clinic.entity';
import { OhipCode } from '../../ohip/entities/ohip-code.entity';

@Entity('pricing_rules')
export class PricingRule {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('decimal', { precision: 10, scale: 2 })
  percentage: number;

  @Column()
  clinicId: number;

  @Column()
  ohipCodeId: string;

  @ManyToOne(() => Clinic, (clinic) => clinic.pricingRules, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'clinicId' })
  clinic: Clinic;

  @ManyToOne(() => OhipCode, (ohipCode) => ohipCode.pricingRules, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'ohipCodeId' })
  ohipCode: OhipCode;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
