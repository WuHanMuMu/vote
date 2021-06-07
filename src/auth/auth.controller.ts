import { Body, Controller, Post, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiHeader, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { loginO, loginReturn } from './auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private service: AuthService) {
  }

  @Post('/login')
  @ApiOperation({
    tags: ['权限相关'],
    summary: '登录',
  })
  @ApiResponse({ type: loginReturn })
  async login(@Body() param: loginO): Promise<loginReturn> {
    if (param.name == 'admin' && param.password == '123456') {
      return this.service.login();
    }
    return {
      'access_token': null,
    };
  }


}
