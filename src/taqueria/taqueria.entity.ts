import { User } from 'src/auth/user.entity';
import {
  BaseEntity,
  BeforeInsert,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TaqueriaStatus } from './taqueria-status.enum';
import { GoogleFiles } from '../google-upload/google-upload.entity';

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
  timeOpen: Date;

  @Column({ nullable: true })
  timeClose: Date;
  @Column({ nullable: true })
  address: string;
  @Column({ nullable: true })
  daysOfTheWeek: string;

  @Column()
  status: TaqueriaStatus;

  @OneToMany(
    () => GoogleFiles,
    photo => photo.taqueria,
    { nullable: true },
  )
  photos: GoogleFiles[];

  @ManyToOne(
    () => User,
    user => user.taquerias,
    { eager: false },
  )
  user: User;

  @Column()
  userId: number;
}
