import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne } from 'typeorm';
import { Patient } from '../../patients/entities/patient.entity';
import { Invoice } from '../../invoices/entities/invoice.entity';

@Entity('billing_sessions')
export class BillingSession {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  patientId: number;

  @ManyToOne(() => Patient)
  patient: Patient;

  @ManyToOne(() => Invoice)
  invoice: Invoice;

  @Column('decimal', { precision: 10, scale: 2 })
  total: number;

  @Column('jsonb', { nullable: true })
  services: any;

  @OneToMany(() => Invoice, invoice => invoice.billingSession)
  invoices: Invoice[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
