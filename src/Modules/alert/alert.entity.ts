import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('alerts')
export class Alert {
  @PrimaryGeneratedColumn()
  'S/N': number;

  @Column()
  title!: string;

  @Column()
  message!: string;

  @Column()
  location!: string;

  @Column({ default: false })
  read!: boolean;

  @Column()
  time!: string;
}
