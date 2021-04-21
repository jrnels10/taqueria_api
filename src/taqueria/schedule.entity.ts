// import {
//   BaseEntity,
//   BeforeInsert,
//   Column,
//   Entity,
//   ManyToOne,
//   OneToMany,
//   OneToOne,
//   PrimaryGeneratedColumn,
// } from 'typeorm';
// import { Taqueria } from './taqueria.entity';

// @Entity()
// export class Schedule extends BaseEntity {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @Column({ nullable: true })
//   timeOpen: Date;

//   @Column({ nullable: true })
//   timeClose: Date;

//   @Column()
//   tacoId: number;

//   @Column('boolean', { default: false })
//   sunday: boolean;

//   @Column('boolean', { default: false })
//   monday: boolean;

//   @Column('boolean', { default: false })
//   tuesday: boolean;

//   @Column('boolean', { default: false })
//   wednesday: boolean;

//   @Column('boolean', { default: false })
//   thursday: boolean;

//   @Column('boolean', { default: false })
//   friday: boolean;

//   @Column('boolean', { default: false })
//   saturday: boolean;

//   @OneToOne(
//     () => Taqueria,
//     taco => taco.schedule,
//   )
//   taqueria: Taqueria;
// }
