import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {
  }

  async validateUser(username: string, pass: string): Promise<any> {
    console.log('=====>', username, pass);
    if (username == 'admin' && pass == '123456') {
      return { user: 'admin' };
    }
    return null;
  }

  async login() {
    const payload = { username: 'admin', sub: 1 };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
