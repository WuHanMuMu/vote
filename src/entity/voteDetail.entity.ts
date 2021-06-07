import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { VoteEntity } from './vote.entity';
import { JoinColumn } from 'typeorm/browser';

@Entity()
export class VoteDetailEntity extends BaseEntity {
  @Column()
  voteId: number;
  @Column()
  choiceDetail: string;
  @Column()
  voteCount: number;
  // @JoinColumn({ name: 'voteId' })
  @ManyToOne(() => VoteEntity, vote => vote.details)
  vote: VoteEntity;
}
