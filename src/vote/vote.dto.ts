import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsNumber, Length, Matches, Max } from 'class-validator';
import { VoteEntity } from '../entity/vote.entity';

class voteVerbDto {
  @ApiProperty({ description: '投票id' })
  voteId: number;
  @ApiProperty({ description: '用户id' })
  userId: number;
  @ApiProperty({ description: '投票详情id' })
  voteDetailId: number;
}

class voteDetail {
  @ApiProperty({ description: '投票备选想' })
  name: string;
  voteCount?: number;
  voteId?: number;
}

class createDetailDto {
  @ApiProperty({ description: '投票备选想' })
  names: string[];
  @ApiProperty({ description: '投票id' })
  voteId: number;
}

class voteDto {
  @ApiProperty({ description: '投票名称' })
  name: string;
  @ApiProperty({ description: '投票选项名称', isArray: true, type: voteDetail })
  details: voteDetail[];
}

class voteOtd {
  @ApiProperty({ description: 'id' })
  id: number;
  @ApiProperty({ description: '投票名称' })
  name: string;
  @ApiProperty({ isArray: true, type: voteDetail })
  details: voteDetail[];
}


class updateVoteDto {
  @ApiProperty({ description: '投票id' })
  voteId: number;
  status?: number;
}


class checkUserDto {
  @ApiProperty({ description: '邮箱' })
  @IsEmail()
  email: string;
  @ApiProperty({ description: '身份证号' })
  @Matches(/[A-Z]\d{6}\(\d\)/, { message: '请输入合法的身份证号码' })
  @Length(10, 10, { message: '长度不正确' })
  no: string;
}

class listOptionDto {
  @IsNumber()
  @ApiProperty({ description: '开始下标' })
  indexFrom: number;
  @ApiProperty({ description: '结束下标' })
  @IsNumber()
  indexTo: number;
}

class listOtd {
  @ApiProperty({ isArray: true, type: voteOtd })
  list: voteOtd[];
  @ApiProperty({ description: '总数' })
  count: number;
}

class userOtd {
  @ApiProperty({ description: 'id' })
  id: number;
  @ApiProperty({ description: '邮箱' })
  email: string;
  @ApiProperty({ description: '身份证编号' })
  no: string;
}

class voteLogDto extends listOptionDto {
  @ApiProperty({ description: '投票id' })
  voteId: number;
}

class voteLogOtd {
  @ApiProperty()
  email: string;
  @ApiProperty()
  no: string;
  @ApiProperty()
  userId: number;
  @ApiProperty()
  voteDetailName: string;
  @ApiProperty()
  voteName: string;

}

class voteLogListOtd {
  @ApiProperty({ description: '数据条数' })
  count: number;
  @ApiProperty({ type: voteLogOtd, isArray: true })
  list: voteLogOtd[];
}


export {
  voteVerbDto, voteDto, createDetailDto, updateVoteDto, checkUserDto, listOptionDto, listOtd, voteOtd, userOtd,
  voteLogDto, voteLogListOtd,
};
