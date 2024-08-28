import { Cart } from 'src/cart/cart.entity';
import { Category } from 'src/category/category.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  price: number;

  @OneToMany(() => Cart, (cart) => cart.product)
  carts: Cart[];

  @ManyToOne(() => Category, (category) => category.products)
  category: Category;
}
