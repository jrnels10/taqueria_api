import { User } from 'src/auth/user.entity';
import { Taqueria } from 'src/taqueria/taqueria.entity';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class GoogleFiles extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fileName: string;

  @Column()
  fileUrl: string;

  @Column()
  fileSize: number;

  @ManyToOne(
    () => Taqueria,
    taqueria => taqueria.photos,
    { eager: false },
  )
  @JoinColumn()
  taqueria: Taqueria;

  @Column()
  taqueriaId: number;

  @ManyToOne(
    () => User,
    user => user.photos,
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
