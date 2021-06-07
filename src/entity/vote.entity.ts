import { Column, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { VoteDetailEntity } from './voteDetail.entity';

@Entity()
export class VoteEntity extends BaseEntity {
  @Column({
    comment: '投票名称',
  })
  name: string;
  @Column({
    comment: '投票状态 1可投票 0不可与',
    default: 1,
  })
  status: number;
  @JoinColumn({ name: 'voteId' })
  @OneToMany((type) => VoteDetailEntity, (voteDetail) => voteDetail.vote)
  details: VoteDetailEntity[];
}
