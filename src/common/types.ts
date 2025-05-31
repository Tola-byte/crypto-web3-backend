import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Request } from 'express';
import { AuthConfig } from 'src/config/auth.config';
import { UserEntity } from 'src/modules/user/user.entity';

export interface myConfigType {
  database: TypeOrmModuleOptions;
  auth: AuthConfig;
  mail: MailConfig;
}

export interface MailConfig {
  mail: {
    host: string;
    port: number;
    user: string;
    pass: string;
  };
}

export interface ApiCallResponse {
  message: string;
  success: boolean;
}
export interface AuthResponse {
  accessToken: string;
  refreshToken?: string;
  user: UserEntity;
}

export class ChangePasswordParams {
  verified: boolean;
  email: string;
}

export interface AuthenticatedRequest extends Request {
  user: {
    email: string;
    verified: boolean;
  };
}
