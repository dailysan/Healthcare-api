import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('audit_logs')
export class AuditLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'jsonb' })
  data: any;

  @Column({ type: 'varchar' })
  resource: string;

  @Column({ type: 'varchar' })
  resourceId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'varchar', length: 50 })
  module: string;

  @Column({ type: 'varchar', length: 100 })
  entityId: string;

  @Column({ type: 'varchar' })
  action: string;

  @Column({ type: 'varchar' })
  userId: string;

  @Column({ type: 'varchar', length: 50 })
  ipAddress: string;
}
