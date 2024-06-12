import { Controller, Post, Body, Res, Get, UseGuards, Req, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Res() res, @Body() loginData: LoginDto) {
    const loginDto = plainToClass(LoginDto, loginData);
    const errors = await validate(loginDto);

    if (errors.length > 0) {
      const errorMessages = errors.map(error => ({
        property: error.property,
        messages: Object.values(error.constraints)
      }));
      return res.status(400).json({ message: 'Validation Error', errors: errorMessages });
    }

    const user = await this.authService.validateUser(loginData);
    if (!user) {
      return res.status(401).json({ message: 'Invalid Credentials' });
    }

    const token = await this.authService.login(user);
    return res.status(200).json(token);
  }

  @Get('validate-token')
  @UseGuards(AuthGuard('jwt'))
  validateToken(@Req() req) {
    return req.user;
  }

  @Post('renew-token')
  @UseGuards(AuthGuard('jwt'))
  async renewToken(@Req() req, @Res() res) {
    const user = req.user;
    const newToken = await this.authService.login(user);
    return res.status(200).json(newToken);
  }
  @Post('logout')
  @UseGuards(AuthGuard('jwt'))
  async logout(@Req() req, @Res() res) {
    try {
      await this.authService.logout(req.user.userId);
      return res.status(HttpStatus.OK).json({ message: 'Logged out successfully' });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Error logging out', error: error.message });
    }
  }

}