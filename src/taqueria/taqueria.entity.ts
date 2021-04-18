import { User } from 'src/auth/user.entity';
import {
  BaseEntity,
  BeforeInsert,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TaqueriaStatus } from './taqueria-status.enum';

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

  @ManyToOne(
    type => User,
    user => user.taquerias,
    { eager: false },
  )
  user: User;

  @Column()
  userId: number;
}
