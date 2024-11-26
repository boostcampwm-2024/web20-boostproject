import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { FieldEnum } from './enum/field.enum';

@Entity()
export class Member {
  @PrimaryGeneratedColumn({ name: 'memberId' })
  id: number;

  @Column({ length: 25, nullable: true })
  name: string;

  @Column({ length: 100, nullable: true })
  email: string;

  @Column({ type: 'text', nullable: true })
  profileImage: string;

  @Column({ name: 'camperId', nullable: true })
  camperId: string;

  @Column({ nullable: true })
  field: FieldEnum;

  @Column({ type: 'text', nullable: true })
  github: string;

  @Column({ type: 'text', nullable: true })
  linkedin: string;

  @Column({ type: 'text', nullable: true })
  blog: string;

  @CreateDateColumn({ name: 'createdAt' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updatedAt' })
  updatedAt: Date;
}
