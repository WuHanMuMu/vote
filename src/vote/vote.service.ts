import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { VoteEntity } from '../entity/vote.entity';
import { VoteLogEntity } from '../entity/voteLog.entity';
import { VoteDetailEntity } from '../entity/voteDetail.entity';
import { createDetailDto, updateVoteDto, voteDto } from './vote.dto';
import { UserEntity } from '../entity/user.entity';

@Injectable()
export class VoteService {
  constructor(@InjectRepository(VoteEntity) private Vote: Repository<VoteEntity>,
              @InjectRepository(VoteLogEntity) private VoteLog: Repository<VoteLogEntity>,
              @InjectRepository(VoteDetailEntity) private VoteDetail: Repository<VoteDetailEntity>,
              private connection: Connection,
  ) {
  }

  async create(param: voteDto): Promise<number> {
    const queryRunner = await this.connection.createQueryRunner();
    queryRunner.startTransaction();
    try {
      let vote = new VoteEntity();
      vote.name = param.name;
      vote = await queryRunner.manager.save(vote);
      await queryRunner.manager.save(
        param.details.map(value => {
          const detail = new VoteDetailEntity();
          detail.voteId = vote.id;
          detail.choiceDetail = value.name;
          return detail;
        }),
      );
      await queryRunner.commitTransaction();
      return vote.id;
    } catch (e) {
      console.log(e);
      await queryRunner.rollbackTransaction();
    }
  }

  async createDetail(param: createDetailDto): Promise<any> {
    await this.VoteDetail.save(param.names.map(value => {
      const detail = new VoteDetailEntity();
      detail.voteId = param.voteId;
      detail.choiceDetail = value;
      return detail;
    }));
    return param[0].voteId;
  }

  async updateVote(param: updateVoteDto) {
    await this.Vote.update({ id: 1 }, { status: param.status });
  }

  async count(param: { voteId: number, userId: number }) {
    return this.Vote.count({ where: { voteId: param.voteId, userId: param.userId } });
  }

  async checkUser(param: { email: string, no: string }) {
    let user = await this.connection.manager.find(UserEntity, { where: { no: param.no } });
    if (user) return user;
    user = (await this.connection.manager.create(UserEntity, { email: param.email, no: param.no }))[0];
    return user;

  }

  async vote(param: { voteId: number, userId: number, voteDetailId: number }) {
    await this.VoteLog.insert(param);
    await this.VoteDetail.increment({ id: param.voteDetailId }, 'voteCount', 1);
  }

  async voteDetail(voteId: number): Promise<VoteEntity> {
    const vote = await this.Vote.findOne({ where: { id: voteId }, relations: ['details'] });
    return vote;
  }
}
