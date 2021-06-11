import { Module } from '@nestjs/common';
import { VoteController } from './vote.controller';
import { VoteService } from './vote.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VoteEntity } from '../entity/vote.entity';
import { VoteLogEntity } from '../entity/voteLog.entity';
import { VoteDetailEntity } from '../entity/voteDetail.entity';
import { AuthModule } from '../auth/auth.module';
import { UserEntity } from '../entity/user.entity';

@Module({
  controllers: [VoteController],
  providers: [VoteService],
  imports: [
    TypeOrmModule.forFeature([VoteEntity, VoteLogEntity, VoteDetailEntity, UserEntity]),
    AuthModule,
  ],
})
export class VoteModule {
}
