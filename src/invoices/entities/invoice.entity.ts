import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { BillingSession } from '../../billing-sessions/entities/billing-session.entity';
import { Patient } from '../../patients/entities/patient.entity';

@Entity('invoices')
export class Invoice {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => BillingSession, session => session.invoices)
  billingSession: BillingSession;

  @ManyToOne(() => Patient, patient => patient.invoices)
  patient: Patient;

  @Column('decimal', { precision: 10, scale: 2 })
  basePrice: number;

  @Column('decimal', { precision: 10, scale: 2 })
  finalPrice: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  discount: number;

  @Column('text')
  reason: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
