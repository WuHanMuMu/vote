import { Body, Controller, HttpException, Post, UseGuards } from '@nestjs/common';
import { VoteService } from './vote.service';
import {
  checkUserDto,
  createDetailDto,
  listOptionDto,
  listOtd,
  updateVoteDto, userOtd,
  voteDto, voteLogDto, voteLogListOtd,
  voteOtd,
  voteVerbDto,
} from './vote.dto';
import { ApiHeader, ApiOperation, ApiResponse } from '@nestjs/swagger';
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
  @ApiResponse({
    status: 200,
    type: voteOtd
    ,
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
    summary: '投票列表',
    tags: ['投票'],
  })
  @Post('/vote_list')
  @ApiResponse({
    status: 200,
    type: listOtd,
  })
  async voteList(@Body() param: listOptionDto) {
    return this.service.list(param);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiHeader({
    name: 'Authorization',
    description: 'Auth token',
  })
  @ApiOperation({
    summary: '投票详情',
    tags: ['投票'],
  })
  @Post('/vote_detail')
  @ApiResponse({
    status: 200,
    type: voteOtd,
  })
  async voteDetail(@Body() param: updateVoteDto) {
    return this.service.voteDetail(param.voteId);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiHeader({
    name: 'Authorization',
    description: 'Auth token',
  })
  @ApiOperation({
    summary: '投票记录',
    tags: ['投票'],
  })
  @Post('/vote_log')
  @ApiResponse({
    status: 200,
    type: voteLogListOtd,
  })
  async voteLog(@Body() param: voteLogDto) {
    return this.service.voteLog(param);
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
  @ApiResponse({ type: voteOtd })
  @Post('/create_detail')
  async createDetail(@Body() param: createDetailDto) {
    await this.service.createDetail(param);
    return this.service.voteDetail(param.voteId);
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
    await this.service.emit(param.voteId);
    return this.service.voteDetail(param.voteId);
  }

  @ApiOperation({
    summary: '校验用户信息',
    tags: ['投票'],
  })
  @ApiResponse({ type: userOtd })
  @Post('/check_user')
  async checkUser(@Body() param: checkUserDto) {
    return this.service.checkUser(param);
  }

  @ApiOperation({
    summary: '用户投票',
    tags: ['投票'],
  })
  @ApiResponse({
    type: voteOtd,
  })
  @Post('/vote')
  async vote(@Body() param: voteVerbDto) {
    // 判断是否已经开始投票
    const voteStatus = await this.service.checkVoteStatus(param.voteId);
    if (!voteStatus) throw new HttpException('该投票项目已经终止', 403);
    const count = await this.service.countVoteLog({
      voteId: param.voteId,
      userId: param.userId,
    });
    if (count) throw new HttpException('您已经投过票了', 401);
    await this.service.vote(param);
    const detail = await this.service.voteDetail(param.voteId);
    return detail;
  }
}
