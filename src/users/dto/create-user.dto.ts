import { IsNotEmpty, IsEmail, MinLength, IsString, Matches } from 'class-validator';
import { IsCPF } from '../../utils/cpf-validator';

export class CreateUserDto {
  @IsNotEmpty({ message: 'CPF is mandatory' })
  @IsCPF({ message: 'Invalid CPF' })
  cpf: string;

  @IsNotEmpty({ message: 'Name is mandatory' })
  @IsString({ message: 'Name should be a string' })
  name: string;

  @IsNotEmpty({ message: 'Email is mandatory' })
  @IsEmail({}, { message: 'Invalid Email' })
  email: string;

  @IsNotEmpty({ message: 'Password is is mandatory' })
  @MinLength(8, { message: 'The password must be at least 8 characters long' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
    message: 'The password must contain at least one uppercase letter, one lowercase letter, one number and one special character (@$!%*?&).'
  })
  password: string;
}