import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity()
export class UserEntity extends BaseEntity {
  @Column()
  email: string;
  @Column()
  no: string;
}
