import { User } from 'src/auth/user.entity';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TaqueriaStatus } from './taqueria-status.enum';
import { GoogleFiles } from '../google-upload/google-upload.entity';
import { Schedule } from './schedule.entity';

@Entity()
export class Taqueria extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column({ type: 'float' })
  latitude: number;

  @Column({ type: 'float' })
  longitude: number;

  @Column({ nullable: true })
  address: string;

  @Column()
  status: TaqueriaStatus;

  @OneToMany(
    () => GoogleFiles,
    photo => photo.taqueria,
    { nullable: true },
  )
  photos: GoogleFiles[];

  @OneToOne(
    () => Schedule,
    schedule => schedule.taqueria,
    { eager: false },
  )
  schedule: Schedule;

  @ManyToOne(
    () => User,
    user => user.taquerias,
    { eager: false },
  )
  user: User;

  @Column()
  userId: number;

  @Column({ nullable: true })
  createDate: Date;

  @Column({ nullable: true })
  updateDate: Date;
}
