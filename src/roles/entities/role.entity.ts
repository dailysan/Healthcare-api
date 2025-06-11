import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from 'typeorm';
import { User } from '../../common/entities/user.entity';

@Entity('roles')
export class Role {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({ type: 'simple-array' })
  permissions: string[];

  @ManyToMany(() => User, user => user.roles)
  @JoinTable()
  users: User[];
}
