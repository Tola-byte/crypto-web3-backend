import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { AuthConfig } from 'src/config/auth.config';
import { AuthService } from './auth.service';
import { PasswordService } from './password/password.service';
 //import { UserService } from './user.service';
import { AuthController } from './auth.controller';

import { UserEntity } from '../user/user.entity';
import { LocalStrategy } from './strategy/local-auth.strategy';
import { JwtStrategy } from './strategy/jwt.strategy';
import { UserService } from '../user/user.service';
import { UserController } from '../user/user.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    PassportModule,

    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<AuthConfig>('auth')?.jwt.accessToken.secret,
        signOptions: {
          expiresIn: config.get<AuthConfig>('auth')?.jwt.accessToken.expiresIn,
        },
      }),
    }),
  ],

  providers: [
    PasswordService,
    UserService,
    AuthService,
    LocalStrategy,
    JwtStrategy
  ],

  exports: [
    PasswordService,
    UserService,
    AuthService,
    LocalStrategy,
    JwtStrategy
  ],

  controllers: [AuthController, UserController],
})
export class UsersAuthModule {}
