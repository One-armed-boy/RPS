import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  Timestamp,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @CreateDateColumn()
  createdAt: Timestamp;

  @DeleteDateColumn({ nullable: true })
  deletedAt: Timestamp;

  createUser(email: string, password: string) {
    this.email = email;
    this.password = password;
  }
}
