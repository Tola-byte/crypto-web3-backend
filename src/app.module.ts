import { Module } from '@nestjs/common';
import { WalletsModule } from './modules/wallets/wallets.module';
import { UsersAuthModule } from './modules/authentication/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { typeOrmConfig } from './config/database.config';
import { authConfig } from './config/auth.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './modules/user/user.entity';
import { appConfigSchema } from './common/schemas/app.schemas';
import { TypeConfigService } from './config/service.config';



@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [typeOrmConfig, authConfig],
      validationSchema: appConfigSchema,
      validationOptions: {
        abortEarly: true,
      },
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],

      useFactory: (configService: TypeConfigService) => ({
        ...configService.get<TypeConfigService>('database'),
        entities: [UserEntity],
      }),
    }),

   WalletsModule,
   UsersAuthModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
