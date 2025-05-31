import { Exclude, Expose } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  Unique
} from 'typeorm';

@Entity()
@Unique(['email'])
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  @Expose()
  id: string;

  @Column({ type: 'varchar', length: 500, nullable: false })
  @Expose()
  fullName: string;

  @Column({ nullable: false, length: 100 })
  @Index()
  @Expose()
  email: string;

  @Column({ nullable: false })
  @Exclude()
  password: string;

  @CreateDateColumn()
  @Expose()
  createdAt: Date;

  

//   @UpdateDateColumn()
//   @Expose()
//   updatedAt: Date;
}
