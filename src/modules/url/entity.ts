import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';

@Entity('urls')
export class UrlEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'short_code', unique: true, length: 10 })
  @Index()
  shortCode: string;

  @Column({ name: 'original_url', type: 'text' })
  originalUrl: string;

  @Column({ default: 0 })
  clicks: number;

  @Column({ name: 'last_click_at', type: 'timestamp', nullable: true })
  lastClickAt: Date | null;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date = new Date();

  @Column({ name: 'updated_at', type: 'timestamptz', nullable: true })
  updatedAt: Date = new Date();
}
