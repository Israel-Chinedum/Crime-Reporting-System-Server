import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('reports')
export class Report {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  reportId!: string;

  @Column()
  incident_type!: string;

  @Column()
  location!: string;

  @Column({ default: null })
  actual_location!: string;

  @Column()
  description!: string;

  @Column()
  time!: string;

  @Column()
  date!: Date;

  @Column()
  evidence_provided!: boolean;

  @Column({ type: 'jsonb', nullable: true })
  fileMetaData!: { name: string; mimetype: string } | null;

  @Column()
  reported_by!: string;

  @Column()
  type!: string;

  @Column()
  status!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
