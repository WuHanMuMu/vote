import { Test, TestingModule } from '@nestjs/testing';
import { VoteController } from './vote.controller';
import { VoteService } from './vote.service';
import { AuthModule } from '../auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VoteEntity } from '../entity/vote.entity';
import { VoteLogEntity } from '../entity/voteLog.entity';
import { VoteDetailEntity } from '../entity/voteDetail.entity';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from '../entity/user.entity';

describe('VoteController', () => {
  let controller: VoteController;
  let voteId = 0;
  let voteDetailId = 0;
  let userId = 0;
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VoteController],
      providers: [VoteService],
      imports: [
        AuthModule,
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: './data/db.sqlite3',
          synchronize: true,
          // logging: true,
          autoLoadEntities: true,
          entities: ['dist/*/*.entity.{ts,js}'],
          dropSchema: true,
        }),
        TypeOrmModule.forFeature([VoteEntity, VoteLogEntity, VoteDetailEntity, UserEntity]),
      ],
    }).overrideGuard(JwtService).useValue({
      canActivate: () => {
        return true;
      },
    })
      .compile();

    controller = module.get<VoteController>(VoteController);
  });

  it('创建投票', async () => {
    const vote = await controller.create({
      name: '咸饺子或者甜饺子',
      details: [{
        name: '甜的',
      }, {
        name: '咸的',
      }],
    });
    expect(vote.id).toBeDefined();
    voteId = vote.id;
    expect(vote.details).toBeDefined();
    voteDetailId = vote.details[0].id;
  });
  it('用户校验', async function() {
    const user = await controller.checkUser({
      email: '1@qq.com',
      no: 'A12376(8)',
    });
    expect(user.id).toBeDefined();
    userId = user.id;
  });
  it('投票', async function() {
    const detail = await controller.vote({
      voteId: voteId,
      voteDetailId,
      userId,
    });
    expect(detail).toBeDefined();
    expect(detail.details[0].voteCount).toBe(1);
  });
});
