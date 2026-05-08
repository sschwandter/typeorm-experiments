import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { File2 } from './file';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  firstName?: string;

  @Column()
  lastName?: string;

  @Column({ default: true })
  isActive?: boolean;

  @OneToMany(() => File2, (file: File2) => file.user)
  files?: File2[];
}
