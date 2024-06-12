import { Controller, Post, Body, Res, Get, UseGuards, Req, Put } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { AuthGuard } from '@nestjs/passport';
import { UpdateUserDto } from '../auth/dto/update-user.dto';


@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  async create(@Res() res, @Body() userData: CreateUserDto) {
    const createUserDto = plainToClass(CreateUserDto, userData);
    const errors = await validate(createUserDto);

    if (errors.length > 0) {
      const errorMessages = errors.map(error => ({
        property: error.property,
        messages: Object.values(error.constraints)
      }));
      return res.status(400).json({ message: 'Validation Error', errors: errorMessages });
    }

    try {
      const user = await this.usersService.create(userData);
      return res.status(201).json({ message: 'User registered successfully.' });
    } catch (error) {
      return res.status(500).json({ message: 'Error registering user', error: error.message });
    }
  }

  @Get('profile')
  @UseGuards(AuthGuard('jwt'))
  async getProfile(@Req() req, @Res() res) {
    try {
      const user = await this.usersService.findOneByEmail(req.user.username);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      const { password, ...userProfile } = user;
      return res.status(200).json(userProfile);
    } catch (error) {
      return res.status(500).json({ message: 'Error fetching user profile', error: error.message });
    }
  }

  @Put('profile')
  @UseGuards(AuthGuard('jwt'))
  async updateProfile(@Req() req, @Body() updateData: UpdateUserDto, @Res() res) {
    const updateUserDto = plainToClass(UpdateUserDto, updateData);
    const errors = await validate(updateUserDto);

    if (errors.length > 0) {
      const errorMessages = errors.map(error => ({
        property: error.property,
        messages: Object.values(error.constraints)
      }));
      return res.status(400).json({ message: 'Validation Error', errors: errorMessages });
    }

    try {
      const updatedUser = await this.usersService.update(updateData, null, req.user.username);
      const { password, ...userProfile } = updatedUser;
      return res.status(200).json(userProfile);
    } catch (error) {
      return res.status(500).json({ message: 'Error updating user profile', error: error.message });
    }
  }

}
