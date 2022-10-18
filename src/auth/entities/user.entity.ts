import { UserRole } from 'src/shared/enums/UserRolesEnum';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text', { unique: true })
  email: string;

  @Column('text', { unique: true, select: false })
  password: string;

  @Column('text')
  fullname: string;

  @Column('bool', { default: true })
  active: boolean;

  @Column({
    type: 'set',
    enum: UserRole,
    default: [UserRole.USER, UserRole.ADMIN],
  })
  roles: UserRole[];

  @BeforeInsert()
  checkFieldsInsert() {
    this.email = this.email.toLowerCase().trim();
  }

  @BeforeUpdate()
  checkFieldsUpdate() {
    this.checkFieldsInsert();
  }
}
