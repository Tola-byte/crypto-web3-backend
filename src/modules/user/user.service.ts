import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { PasswordService } from '../authentication/password/password.service';
import { CreateUserDTO } from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,

    private readonly passwordService: PasswordService,
  ) {}

  public async findOneByEmail(email: string): Promise<UserEntity | null> {
    if (!email) return null;
    return await this.userRepository.findOneBy({ email });
  }

  public async createUser(data: CreateUserDTO): Promise<UserEntity> {
    const hashedPassword = await this.passwordService.hashPassword(
      data.password,
    );

    const user = this.userRepository.create({
      ...data,
      password: hashedPassword,
    });

    const savedUser = await this.userRepository.save(user);

    return savedUser;
  }

  public async findOneById(id: string): Promise<UserEntity | null> {
    if (!id) return null;
    return await this.userRepository.findOneBy({ id });
  }

}
