import { registerAs } from '@nestjs/config';

export interface AuthConfig {
  jwt: {
    accessToken: {
      secret: string;
      expiresIn: string;
    };
    refreshToken: {
      secret: string;
      expiresIn: string;
    };
  };
}

export const authConfig = registerAs(
  'auth',
  (): AuthConfig => ({
    jwt: {
      accessToken: {
        secret: process.env.JWT_SECRET as string,
        expiresIn: process.env.JWT_ACCESS_EXPIRES_IN ?? '15m',
      },
      refreshToken: {
        secret: process.env.JWT_REFRESH_SECRET as string,
        expiresIn: process.env.JWT_REFRESH_EXPIRES_IN ?? '7d',
      },
    },
  }),
);
