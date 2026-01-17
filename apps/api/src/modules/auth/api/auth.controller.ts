import { Body, Controller, Post, Get } from '@nestjs/common';
import { LoginDto } from './dtos/login.dto';
import { AuthService } from '../core/services/auth.service';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';
import { Public } from 'src/common/decorators/public.decorator';
import { LoginResult } from '../core/models/auth.types';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  @ResponseMessage('Login realizado com sucesso!')
  async login(@Body() loginDto: LoginDto): Promise<LoginResult> {
    return this.authService.login(loginDto);
  }
}
