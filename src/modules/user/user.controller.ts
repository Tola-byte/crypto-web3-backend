import {
    Body,
    Controller,
    HttpException,
    HttpStatus,
    NotFoundException,
    Post,
    Get,
    Request,
    UseGuards,
  } from '@nestjs/common';
  

  import { plainToInstance } from 'class-transformer';

  import { UserEntity } from '../user/user.entity';
  import { UserService } from '../user/user.service';
  import { AuthService } from '../authentication/auth.service';
  import { JwtAuthGuard } from '../authentication/guards/jwt.guard';
 
  
  @Controller('user')
  export class UserController {
    constructor(
      private readonly userService: UserService,
      private readonly authService: AuthService,
    ) {}
  
  
    @UseGuards(JwtAuthGuard)
    @Get('profile')
  
    public getProfile(@Request() req: { user: UserEntity }): UserEntity {
      try {
        if (req.user) {
          const cleanUserData = plainToInstance(UserEntity, req.user, {
            excludeExtraneousValues: true,
          });
  
          return cleanUserData;
        }
        throw new NotFoundException();
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
  