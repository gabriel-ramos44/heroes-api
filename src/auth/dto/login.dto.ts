import { IsNotEmpty, IsEmail, IsString, ValidateIf } from 'class-validator';

export class LoginDto {
  @ValidateIf(o => !o.cpf)
  @IsNotEmpty({ message: 'Email or CPF is mandatory' })
  @IsEmail({}, { message: 'Invalid email' })
  email?: string;

  @ValidateIf(o => !o.email)
  @IsNotEmpty({ message: 'Email or CPF is mandatory' })
  @IsString({ message: 'CPF must be a string' })
  cpf?: string;

  @IsNotEmpty({ message: 'Password is mandatory' })
  @IsString({ message: 'Password must be a string' })
  password: string;
}
