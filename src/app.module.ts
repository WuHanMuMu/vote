import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { VoteModule } from './vote/vote.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import * as Path from 'path';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [VoteModule, TypeOrmModule.forRoot({
    type: 'sqlite',
    database: './data/db.sqlite3',
    entities: ['dist/**/*.entity{.ts,.js}'],
    synchronize: true,
    logging: true,
  }), AuthModule, EventEmitterModule.forRoot(), MailModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
}
