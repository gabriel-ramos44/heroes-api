import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function IsCPF(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'IsCPF',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const cpf = (value || '').replace(/\D/g, '');

          if (cpf.length !== 11) {
            return false;
          }

          if (/(\d)\1{10}/.test(cpf)) {
            return false;
          }

          let sum = 0;
          for (let i = 0; i < 9; i++) {
            sum += parseInt(cpf.charAt(i)) * (10 - i);
          }
          let remainder = 11 - (sum % 11);
          let firstDigit = remainder >= 10 ? 0 : remainder;

          sum = 0;
          for (let i = 0; i < 10; i++) {
            sum += parseInt(cpf.charAt(i)) * (11 - i);
          }
          remainder = 11 - (sum % 11);
          let secondDigit = remainder >= 10 ? 0 : remainder;

          return firstDigit === parseInt(cpf.charAt(9)) && secondDigit === parseInt(cpf.charAt(10));
        },

        defaultMessage(args: ValidationArguments) {
          return 'CPF inválido';
        },
      },
    });
  };
}