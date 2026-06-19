import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('tokens')
export class Token {
  @PrimaryGeneratedColumn()
  'S/N': number;

  @Column()
  username!: string;

  @Column()
  token!: string;
}
