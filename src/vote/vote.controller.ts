import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { VoteService } from './vote.service';
import { checkUserDto, createDetailDto, updateVoteDto, voteDto, voteVerbDto } from './vote.dto';
import { ApiHeader, ApiOperation, ApiProperty } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';


@Controller('vote')
export class VoteController {
  constructor(private service: VoteService) {
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
    const voteId = await this.service.create(param);
    return this.service.voteDetail(voteId);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiHeader({
    name: 'Authorization',
    description: 'Auth token',
  })
  @ApiOperation({
    summary: '投票新增选择',
    tags: ['投票'],
  })
  @Post('/createDetail')
  async createDetail(@Body() param: createDetailDto) {
    const voteId = await this.service.createDetail(param);
    return this.service.voteDetail(voteId);
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
  async start(@Body() param: updateVoteDto) {
    param.status = 1;
    await this.service.updateVote(param);
    return this.service.voteDetail(param.voteId);
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
  @Post('/stop')
  async stop(@Body() param: updateVoteDto) {
    param.status = 0;
    await this.service.updateVote(param);
    return this.service.voteDetail(param.voteId);
  }


  @Post('/check_user')
  async checkUser(@Body() param: checkUserDto) {
    return this.service.checkUser(param);
  }

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
}
