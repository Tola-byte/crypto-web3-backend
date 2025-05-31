import {
    BadRequestException,
    ConflictException,
    HttpException,
    HttpStatus,
    Injectable,
    UnauthorizedException,
  } from '@nestjs/common';
  
  import { JwtService } from '@nestjs/jwt';
  import { UserEntity } from '../user/user.entity';
  import { AuthResponse } from 'src/common/types';
  import { CreateUserDTO } from '../user/dto/user.dto';
  import { PasswordService } from './password/password.service';
  import { UserService } from '../user/user.service';
  import { AuthConfig } from 'src/config/auth.config';
  import { ConfigService } from '@nestjs/config';

  
  @Injectable()
  export class AuthService {
    constructor(
      private readonly userService: UserService,
      private readonly jwtService: JwtService,
    //  private readonly mailerService: MailerService,
      private readonly configService: ConfigService,
      private readonly passwordService: PasswordService,
    ) {}
  
    private generateAccessToken(user: UserEntity): string {
      const payload = { sub: user.id };
      return this.jwtService.sign(payload, {
        secret: `${process.env.JWT_SECRET}`,
      });
    }
  
    private generateRefreshToken(user: UserEntity): string {
      const payload = { sub: user.id };
  
      const refreshSecret =
        this.configService.get<AuthConfig>('auth')?.jwt.refreshToken.secret;
      const refreshExpiresIn =
        this.configService.get<AuthConfig>('auth')?.jwt.refreshToken.expiresIn;
  
      if (!refreshSecret || !refreshExpiresIn) {
        throw new Error('Refresh token config is missing!');
      }
  
      return this.jwtService.sign(payload, {
        secret: refreshSecret,
        expiresIn: refreshExpiresIn,
      });
    }
  
    private generateTokens(user: UserEntity): {
      accessToken: string;
      refreshToken: string;
    } {
      const accessToken = this.generateAccessToken(user);
      const refreshToken = this.generateRefreshToken(user);
  
      return { accessToken, refreshToken };
    }
  
    public async register(data: CreateUserDTO): Promise<AuthResponse> {
      const existingUser = await this.userService.findOneByEmail(data.email);
  
      if (existingUser) {
        throw new ConflictException('User already exist');
      }
  
      const user = await this.userService.createUser(data);
  
      const { accessToken, refreshToken } = this.generateTokens(user);
  
      return { accessToken, refreshToken, user };
    }
  
    
    public async login(email: string, password: string): Promise<AuthResponse> {
      const user = await this.userService.findOneByEmail(email);
      if (!user) {
        throw new UnauthorizedException('Invalid email or password');
      }
  
      if (!(await this.passwordService.verifyPassword(password, user.password))) {
        throw new UnauthorizedException('Invalid email or password');
      }
  
      const { accessToken, refreshToken } = this.generateTokens(user);
  
      return { accessToken, refreshToken, user };
    }
  
   
  }
  