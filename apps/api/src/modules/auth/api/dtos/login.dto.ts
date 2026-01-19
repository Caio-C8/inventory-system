import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'E-mail inválido.' })
  @IsNotEmpty({ message: 'Preencha o campo e-mail.' })
  email!: string;

  @IsString({ message: 'Senha inválida.' })
  @IsNotEmpty({ message: 'Preencha o campo senha.' })
  password!: string;
}
