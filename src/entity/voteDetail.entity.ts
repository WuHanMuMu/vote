import { Column, Entity, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { VoteEntity } from './vote.entity';


@Entity()
export class VoteDetailEntity extends BaseEntity {
  @Column()
  voteId: number;
  @Column()
  choiceDetail: string;
  @Column({ default: 0 })
  voteCount: number;
  @JoinColumn({ name: 'voteId' })
  @ManyToOne(() => VoteEntity, vote => vote.details)
  vote: VoteEntity;
}
