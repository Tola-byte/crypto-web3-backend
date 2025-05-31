//import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, 
    IsNotEmpty,
    Matches,
    MinLength, IsString } from 'class-validator';

export class LoginDTO {
  @IsEmail()
  @Transform(({ value }) => (value as string).trim()) 
  email: string;

  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => (value as string).trim())
  password: string;
}

  
  export class CreateUserDTO {
    @IsNotEmpty()
    @IsString()
    fullName: string;
  
    @IsEmail()
    email: string;
  
    @IsNotEmpty()
    @MinLength(6)
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/, {
      message:
        'Password must be at least 6 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character',
    })
    password: string;
  }
  