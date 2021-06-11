import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';
import { VoteLogEntity } from '../entity/voteLog.entity';
import { UserEntity } from '../entity/user.entity';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private connection: Connection,
              private mail: MailerService) {
  }

  async findAllPeopleForVote(voteId: number) {
    const peoples = await this.connection
      .createQueryBuilder()
      .from(VoteLogEntity, 'vl')
      .leftJoin(UserEntity, 'user', 'user.id = vl.userId')
      .select('user.email', 'email')
      .where(` vl.voteId=:voteId `, { voteId })
      .getRawMany()
    ;
    return peoples;
  }

  async sendMail(email: string, content: string) {
    await this.mail.sendMail({
      to: email,
      subject: 'your vote has been ended',
      from: 'exp@exp.com',
      text: content,
    });
  }
}
