import { Module } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { MailService } from './mail.service';
import { MailerModule } from '@nestjs-modules/mailer';

@Module({
  providers: [MailService],
  imports: [MailerModule.forRoot({
    transport: {
      host: '',
      secure: false,
      auth: {
        user: 'user@example.com',
        pass: 'topsecret',
      },
    },
  })],
})
export class MailModule {
  constructor(private service: MailService) {
  }

  @OnEvent('mail.sendEveryOne')
  async sendEveryOne(voteId: number) {
    const peoples = await this.service.findAllPeopleForVote(voteId);
    for (let i = 0; i < peoples.length; i++) {
      const people = peoples[i];
      await this.service.sendMail(people.email, 'vote end');
    }
  }
}
