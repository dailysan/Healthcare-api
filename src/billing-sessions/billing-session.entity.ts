import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Invoice } from '../invoices/entities/invoice.entity';

@Entity('billing_sessions')
export class BillingSession {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  clinicId: number;

  @Column('decimal', { precision: 10, scale: 2 })
  total: number;

  @Column('text')
  description: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Invoice, invoice => invoice.billingSession)
  invoices: Invoice[];
}
