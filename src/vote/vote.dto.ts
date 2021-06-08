import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, Matches } from 'class-validator';

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
  voteId: number;
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
  @Matches(/[A-Z]\d{6}\(\d\)/)
  no: string;
}

export {
  voteVerbDto, voteDto, createDetailDto, updateVoteDto, checkUserDto,
};
