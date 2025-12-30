import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

export enum CarCategory {
  ELECTRIC = 'Electric',
  SPORT = 'Sport',
  LUXURY = 'Luxury',
  SUV = 'SUV',
  SEDAN = 'Sedan',
  CONVERTIBLE = 'Convertible',
}

@Entity()
export class Car {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  brand: string;

  @Column()
  model: string;

  @Column('decimal')
  pricePerDay: number;

  @Column({ default: 'USD' })
  currency: string;

  @Column({
    type: 'simple-enum',
    enum: CarCategory,
  })
  category: CarCategory;

  @Column()
  image: string;

  @Column({ default: true })
  available: boolean;

  @Column('simple-array')
  features: string[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
