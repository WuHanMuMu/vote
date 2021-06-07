import { ApiProperty } from '@nestjs/swagger';

class loginO {
  @ApiProperty({ description: '登录名 （admin）' })
  name: string;
  @ApiProperty({ description: '密码（123456）' })
  password: string;
}

class loginReturn {
  @ApiProperty({ description: 'token' })
  'access_token': string;
}

export { loginO, loginReturn };
