import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { VoteService } from './vote.service';
import { voteDto, voteVerbDto } from './vote.dto';
import { ApiBearerAuth, ApiHeader, ApiOperation, ApiProperty } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';


@Controller('vote')
export class VoteController {
  constructor(private service: VoteService) {
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiOperation({
    summary: '用户投票',
    tags: ['投票'],
  })
  @Post('/vote')
  async vote(@Body() param: voteVerbDto) {
    const count = await this.service.count({
      voteId: param.voteId,
      userId: param.userId,
    });
    if (count) return new Error('您已经投过票了');
    await this.service.vote(param);
    const detail = await this.service.voteDetail(param.voteId);
    return detail;
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiHeader({
    name: 'Authorization',
    description: 'Auth token',
  })
  @ApiOperation({
    summary: '创建投票',
    tags: ['投票'],
  })
  @Post('/create')
  async create(@Body() param: voteDto) {
    await this.service.create(param);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiHeader({
    name: 'Authorization',
    description: 'Auth token',
  })
  @ApiOperation({
    summary: '开始投票',
    tags: ['投票'],
  })
  @Post('/start')
  async start(@Body() param: voteDto) {
    await this.service.create(param);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiHeader({
    name: 'Authorization',
    description: 'Auth token',
  })
  @ApiOperation({
    summary: '停止投票',
    tags: ['投票'],
  })
  @Post('/end')
  async end(@Body() param: voteDto) {
    await this.service.create(param);
  }
}
