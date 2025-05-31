import {
    Body,
    Controller,
    HttpCode,
    HttpException,
    HttpStatus,
    Post,
    Get,
    Param,
    UseGuards,
    Req,
  } from '@nestjs/common';
  import { AuthService } from './auth.service';
  import { plainToInstance } from 'class-transformer';
import { CreateUserDTO, LoginDTO } from '../user/dto/user.dto';
import { AuthResponse } from 'src/common/types';
import { UserEntity } from '../user/user.entity';
import { LocalAuthGuard } from './guards/local-auth.guard';
  
  
  @Controller('auth')
  export class AuthController {
    constructor(private readonly authService: AuthService) {}

    
    @Post('register')
    public async register(@Body() data: CreateUserDTO): Promise<AuthResponse> {
      try {
        const { user, accessToken, refreshToken } =
          await this.authService.register(data);
  
        const cleanUserData = plainToInstance(UserEntity, user, {
          excludeExtraneousValues: true,
        });
  
        return { accessToken, refreshToken, user: cleanUserData };
      } catch (error: unknown) {
        let status = HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'Unexpected error';
  
        if (
          typeof error === 'object' &&
          error !== null &&
          'status' in error &&
          'message' in error
        ) {
          const e = error as { status?: number; message?: string };
          status = e.status ?? status;
          message = e.message ?? message;
        }
        throw new HttpException({ message, status }, status);
      }
    }
  
    @UseGuards(LocalAuthGuard)
    @Post('login')
    @HttpCode(HttpStatus.OK)
    public async login(@Body() data: LoginDTO): Promise<AuthResponse> {
      try {
        const { user, accessToken, refreshToken } = await this.authService.login(
          data.email,
          data.password,
        );
  
        const cleanUserData = plainToInstance(UserEntity, user, {
          excludeExtraneousValues: true,
        });
  
        return { accessToken, refreshToken, user: cleanUserData };
      } catch (error: unknown) {
        let status = HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'Unexpected error';
  
        if (
          typeof error === 'object' &&
          error !== null &&
          'status' in error &&
          'message' in error
        ) {
          const e = error as { status?: number; message?: string };
          status = e.status ?? status;
          message = e.message ?? message;
        }
  
        throw new HttpException({ message, status }, status);
      }
    }
  }
  