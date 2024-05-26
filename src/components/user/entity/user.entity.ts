import { hash, genSaltSync, compareSync } from 'bcryptjs';
import { classToPlain, Exclude } from 'class-transformer';
import { IsEmail, Matches } from 'class-validator';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { UserRole } from './user-role.entity';
import { Abstract } from 'src/common/entity/abstract.entity';

@Entity({ name: 'users' })
export class User extends Abstract {
  @Column({
    name: 'first_name',
  })
  firstName: string;

  @Column({
    name: 'last_name',
  })
  lastName: string;

  @Column({
    nullable: true,
  })
  phone: string;

  @Column({
    unique: true,
  })
  @IsEmail()
  @Matches(/^[^+]+@.*$/, {
    message: 'cannot be an email alias',
  })
  email: string;

  @Column({
    name: 'is_verified',
    default: false,
  })
  isVerified: boolean;

  @OneToOne(() => UserRole)
  @JoinColumn({ name: 'role' })
  role: UserRole;

  @Column()
  @Exclude()
  password: string;

  @BeforeInsert()
  async hashPassword() {
    this.password = await hash(this.password, genSaltSync(10));
  }

  // @BeforeUpdate()
  async newPassword(password: string) {
    return await hash(password, genSaltSync(10));
  }

  compare(unencryptedString: string): boolean {
    return compareSync(unencryptedString, this.password);
  }

  toJSON() {
    return classToPlain(this);
  }
}
