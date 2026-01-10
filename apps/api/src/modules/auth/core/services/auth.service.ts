import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginCredentials } from '../models/login-credentials.interface';
import { LoginResponse } from '../models/login-response.interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    const user = this.validateUser(credentials.email, credentials.password);

    if (!user) {
      throw new UnauthorizedException('E-mail ou senha inválidos');
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

  private validateUser(email: string, password: string) {
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
