import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { jwtConstants } from 'src/config/jwt.config';

@Injectable()
export class AuthService {
  private invalidatedTokens = new Set<string>();

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(credentials: LoginDto): Promise<any> {
    const { email, cpf, password } = credentials;
    const user = email ?
        await this.usersService.findOneByEmail(email)
        :
        await this.usersService.findOneByCpf(cpf);

    if (user && await bcrypt.compare(password, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { username: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async logout(userId: number) {
    const payload = { sub: userId };
    const token = this.jwtService.sign(payload, { secret: jwtConstants.secret });
    this.invalidatedTokens.add(token);
  }

  isTokenInvalidated(token: string): boolean {
    return this.invalidatedTokens.has(token);
  }
}
