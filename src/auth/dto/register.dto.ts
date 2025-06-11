import { IsString, MinLength, MaxLength, IsEmail } from 'class-validator';
import { CreateUserDto } from '../../common/dto/user.dto';

export class RegisterDto extends CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsString()
  @MinLength(2)
  firstName: string;

  @IsString()
  @MinLength(2)
  @MaxLength(50)
  lastName: string;
}
