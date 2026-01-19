import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { LoginParams, LoginResult } from '../models/auth.types';
import { User } from '../models/user.model';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async login(credentials: LoginParams): Promise<LoginResult> {
    const user = this.validateUser(credentials.email, credentials.password);

    if (!user) {
      throw new UnauthorizedException('E-mail ou senha inválidos.');
    }

    const payload = {
      sub: user.id,
      email: user.email,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };
  }

  private validateUser(email: string, password: string): User | null {
    const emailAdmin = this.configService.get<string>('ADMIN_EMAIL');
    const passwordAdmin = this.configService.get<string>('ADMIN_PASSWORD');

    if (email !== emailAdmin || password !== passwordAdmin) {
      return null;
    }

    return {
      id: '1',
      email: emailAdmin,
      name: 'Administrator',
    };
  }
}
