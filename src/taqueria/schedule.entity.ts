import {
  BaseEntity,
  BeforeInsert,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Taqueria } from './taqueria.entity';

@Entity()
export class Schedule extends BaseEntity {
  constructor(partial: Partial<Schedule>) {
    super();
    Object.assign(this, partial);
  }
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  timeOpen: Date;

  @Column({ nullable: true })
  timeClose: Date;

  @Column('boolean', { default: false })
  sunday: boolean;

  @Column('boolean', { default: false })
  monday: boolean;

  @Column('boolean', { default: false })
  tuesday: boolean;

  @Column('boolean', { default: false })
  wednesday: boolean;

  @Column('boolean', { default: false })
  thursday: boolean;

  @Column('boolean', { default: false })
  friday: boolean;

  @Column('boolean', { default: false })
  saturday: boolean;

  @OneToOne(
    () => Taqueria,
    taqueria => taqueria.schedule,
    { eager: false },
  )
  @JoinColumn()
  taqueria: Taqueria;

  @Column()
  taqueriaId: number;

  @Column({ nullable: true })
  createDate: Date;

  @Column({ nullable: true })
  updateDate: Date;
}
