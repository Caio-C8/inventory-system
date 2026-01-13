import { Body, Controller, Post, Get } from '@nestjs/common';
import { LoginDto } from './dtos/login.dto';
import { AuthService } from '../core/services/auth.service';
import { LoginResponse } from '../core/models/login-response.interface';
import { ResponseMessage } from 'src/common/decorators/response-message.decorator';
import { Public } from '../../../common/decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  @ResponseMessage('Login realizado com sucesso!')
  async login(@Body() loginDto: LoginDto): Promise<LoginResponse> {
    return this.authService.login(loginDto);
  }
}
