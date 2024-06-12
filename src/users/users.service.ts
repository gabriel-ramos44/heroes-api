import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { ObjectId } from 'mongodb';
import { UpdateUserDto } from 'src/auth/dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findOneByEmail(email: string): Promise<User | undefined> {
    return this.usersRepository.findOne({ where: { email: email } });
  }

  async findOneByCpf(cpf: string): Promise<User | undefined> {
    return this.usersRepository.findOne({ where: { email: cpf } });
  }

  async findOneById(id: string): Promise<User | undefined> {
    return this.usersRepository.findOne({ where: { _id: new ObjectId(id)} });
  }

  async create(CreateUserDto: CreateUserDto): Promise<User> {
    const { cpf, name, email, password } = CreateUserDto;

    const existingUserCpf = await this.usersRepository.findOne({
      where: { cpf: cpf }
    });

    if (existingUserCpf ) {
      throw new Error('CPF já cadastrado.');
    }

    const existingUserEmail = await this.usersRepository.findOne({
      where: { email: email }
    });

    if (existingUserEmail ) {
      throw new Error('Email já cadastrado');
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = this.usersRepository.create({
      cpf,
      name,
      email,
      password: hashedPassword,
    });

    this.usersRepository.save(user)

    return user
  }

  async update(updateUserDto: UpdateUserDto, id?: string, email?: string): Promise<User> {

    console.log(id)
    console.log(email)
    const user = id ?
                 await this.findOneById(id)
                 : email ?
                 await this.findOneByEmail(email)
                 : null

    if (!user) {
      throw new Error('User not found');
    }

    Object.assign(user, updateUserDto);
    if (updateUserDto.password) {
      user.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    await this.usersRepository.save(user);
    return user;
  }

}
