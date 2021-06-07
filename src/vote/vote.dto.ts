import { ApiProperty } from '@nestjs/swagger';

class voteVerbDto {
  voteId: number;
  userId: number;
  voteDetailId: number;
}

class voteDetail {
  @ApiProperty({ description: '投票备选想' })
  name: string;
  @ApiProperty({ description: '投票数量' })
  voteCount?: number;
  voteId: number;
}

class voteDto {
  @ApiProperty({ description: '投票名称' })
  name: string;
  @ApiProperty({ description: '投票选项名称', isArray: true, type: voteDetail })
  details: voteDetail[];
}


export {
  voteVerbDto, voteDto,
};
