import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity()
export class VoteLogEntity extends BaseEntity {
  @Column()
  voteId: number;
  @Column()
  choiceDetailId: number;
  @Column({
    comment: '投票用户id',
  })
  userId: number;
}
