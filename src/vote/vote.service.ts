import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Connection, Repository } from 'typeorm';
import { VoteEntity } from '../entity/vote.entity';
import { VoteLogEntity } from '../entity/voteLog.entity';
import { VoteDetailEntity } from '../entity/voteDetail.entity';
import { createDetailDto, listOptionDto, updateVoteDto, voteDto, voteLogDto, voteLogListOtd } from './vote.dto';
import { UserEntity } from '../entity/user.entity';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class VoteService {
  constructor(@InjectRepository(VoteEntity) private Vote: Repository<VoteEntity>,
              @InjectRepository(VoteLogEntity) private VoteLog: Repository<VoteLogEntity>,
              @InjectRepository(VoteDetailEntity) private VoteDetail: Repository<VoteDetailEntity>,
              @InjectRepository(UserEntity) private User: Repository<UserEntity>,
              private connection: Connection,
              private eventEmitter: EventEmitter2,
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

  async list(param: listOptionDto): Promise<{ list: VoteEntity[], count: number }> {
    const [list, count] = await this.Vote.findAndCount({
      skip: param.indexFrom,
      take: param.indexTo - param.indexFrom,
      order: { 'createdAt': 'DESC' },
    });
    return { list, count };
  }

  async createDetail(param: createDetailDto): Promise<any> {
    await this.VoteDetail.save(param.names.map(value => {
      const detail = new VoteDetailEntity();
      detail.voteId = param.voteId;
      detail.choiceDetail = value;
      return detail;
    }));
  }

  async updateVote(param: updateVoteDto) {
    await this.Vote.update({ id: param.voteId }, { status: param.status });
  }

  async countVoteLog(param: { voteId: number, userId: number }) {
    return this.VoteLog.count({ where: { voteId: param.voteId, userId: param.userId } });
  }

  async checkVoteStatus(voteId: number): Promise<boolean> {
    const count = await this.Vote.count({ where: { id: voteId, status: 1 } });
    return count > 0;
  }

  async checkUser(param: { email: string, no: string }) {
    let user = await this.User.findOne({ where: { no: param.no } });
    if (user) return user;
    user = new UserEntity();
    user.email = param.email;
    user.no = param.no;
    user = await this.User.save(user);
    return user;
  }

  async vote(param: { voteId: number, userId: number, voteDetailId: number }) {
    const queryRunner = await this.connection.createQueryRunner();
    queryRunner.startTransaction();
    try {
      await this.VoteLog.insert(param);
      await this.VoteDetail.increment({ id: param.voteDetailId }, 'voteCount', 1);
      await queryRunner.commitTransaction();
    } catch (e) {
      console.error(e);
      await queryRunner.rollbackTransaction();
    }
  }

  async voteDetail(voteId: number): Promise<VoteEntity> {
    const vote = await this.Vote.findOne({ where: { id: voteId }, relations: ['details'] });
    return vote;
  }

  async voteLog(param: voteLogDto): Promise<voteLogListOtd> {
    const qb = this.connection.createQueryBuilder()
      .select('user.email', 'email')
      .addSelect('vl.userId')
      .addSelect('user.no', 'no')
      .addSelect('vote.name', 'voteName')
      .addSelect('voteDetail.choiceDetail', 'voteDetailName')
      .from(VoteLogEntity, 'vl')
      .leftJoin(UserEntity, 'user', 'user.id = vl.userId')
      .leftJoin(VoteEntity, 'vote', 'vote.id = vl.voteId')
      .leftJoin(VoteDetailEntity, 'voteDetail', 'voteDetail.id = vl.voteDetailId')
      .where('vl.voteId = :voteId', { voteId: param.voteId })
      .skip(param.indexFrom)
      .limit(param.indexTo - param.indexFrom);

    const count = await qb.getCount();
    const list = await qb.getRawMany();
    return { list, count };
  }

  async emit(voteId: number) {
    this.eventEmitter.emit('mail.sendEveryOne', voteId);
  }
}


