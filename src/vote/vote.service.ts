import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VoteEntity } from '../entity/vote.entity';
import { VoteLogEntity } from '../entity/voteLog.entity';
import { VoteDetailEntity } from '../entity/voteDetail.entity';
import { voteDto } from './vote.dto';

@Injectable()
export class VoteService {
  constructor(@InjectRepository(VoteEntity) private Vote: Repository<VoteEntity>,
              @InjectRepository(VoteLogEntity) private VoteLog: Repository<VoteLogEntity>,
              @InjectRepository(VoteDetailEntity) private VoteDetail: Repository<VoteDetailEntity>,
  ) {
  }

  async create(param: voteDto) {
    const vote = await this.Vote.create({ name: param.name });
    await this.VoteDetail.save(param.details.map(value => {
      const detail = new VoteDetailEntity();
      detail.voteId = vote.id;
      detail.choiceDetail = value.name;
      return detail;
    }));
  }

  async count(param: { voteId: number, userId: number }) {
    return this.Vote.count({ where: { voteId: param.voteId, userId: param.userId } });
  }

  async vote(param: { voteId: number, userId: number, voteDetailId: number }) {
    await this.VoteLog.insert(param);
    await this.VoteDetail.increment({ id: param.voteDetailId }, 'voteCount', 1);
  }

  async voteDetail(voteId: number) {
    // this.Vote.findOne({ where: { id: voteId }, include: {} });
    return this.Vote.findOne({ where: { id: voteId }, relations: ['details'] });
    // return '';
  }
}
