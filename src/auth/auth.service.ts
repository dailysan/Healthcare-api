import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../common/utils/users.service';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    try {
      console.log('Validating user with email:', email);
      const user = await this.usersService.findByEmail(email);
      if (!user) {
        console.log('User not found');
        return null;
      }

      console.log('User found, checking password');
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        console.log('Invalid password');
        return null;
      }

      console.log('Authentication successful');
      return user;
    } catch (error) {
      console.error('Error validating user:', error);
      return null;
    }
  }

  async login(user: any) {
    try {
      console.log('Generating JWT token for user:', user.id);
      const payload = { 
        userId: user.id,
        email: user.email
      };
      
      const token = this.jwtService.sign(payload);
      console.log('JWT token generated successfully');
      
      return { 
        access_token: token,
        user: { 
          id: user.id,
          email: user.email
        }
      };
    } catch (error) {
      console.error('Error generating JWT token:', error);
      throw error;
    }
  }

  async register(registerDto: RegisterDto) {
    const user = await this.usersService.create(registerDto);
    return {
      message: 'User registered successfully',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName
      }
    };
  }
}