import { Column, Entity } from 'typeorm';

@Entity('alerts')
export class Alert {
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
