import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { RoleEnum } from '../utils/role.enum';
import { ConfigsService } from '../../configs/configs.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../dto/user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User, 'default') private readonly userRepository: Repository<User>,
    private readonly configsService: ConfigsService
  ) {
    if (!this.userRepository) {
      throw new Error('User repository not initialized');
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    try {
      console.log('Searching for user with email:', email);
      const user = await this.userRepository.findOne({
        where: { email }
      });
      console.log('User found:', user ? 'Yes' : 'No');
      return user;
    } catch (error) {
      console.error('Error finding user:', error);
      return null;
    }
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const existingUser = await this.findByEmail(createUserDto.email);
      if (existingUser) {
        throw new Error('Email already registered');
      }

      const saltRoundsConfig = await this.configsService.findOne('saltRounds');
      const saltRounds = parseInt(saltRoundsConfig.value, 10) || 10;

      const hashedPassword = await bcrypt.hash(createUserDto.password, saltRounds);

      const user = User.create({
        email: createUserDto.email,
        password: hashedPassword,
        firstName: createUserDto.firstName,
        lastName: createUserDto.lastName
      });

      return await this.userRepository.save(user);
    } catch (error) {
      console.error('Error creating user:', error);
      if (error.code === '23505') { 
        throw new Error('Email already registered');
      } else {
        throw error;
      }
    }
  }
}
