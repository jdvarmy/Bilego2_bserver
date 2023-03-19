import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Items } from './Items';

@Entity()
export class ItemClosestMetro {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @ManyToOne(() => Items, (item) => item.itemClosestMetro, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  item: Items;

  @Column({ nullable: true })
  metro: string;

  @Column({ nullable: true })
  color: string;
}
