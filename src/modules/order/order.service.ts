import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from '../cart/cart.entity';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
  ) {}

  async findAll(): Promise<Order[]> {
    return this.orderRepository.find({
      relations: ['items', 'items.product', 'user'],
    });
  }

  async createOrder(
    cartItems: Cart[],
    userId: number,
    paymentMethod: string,
  ): Promise<Order> {
    const orderItems = cartItems.map((cartItem) => {
      const orderItem = new OrderItem();
      orderItem.product = cartItem.product;
      orderItem.quantity = cartItem.quantity;
      orderItem.price = cartItem.product.price;
      orderItem.subTotal = cartItem.product.price * cartItem.quantity;
      return orderItem;
    });

    const total = orderItems.reduce((sum, item) => sum + item.subTotal, 0);

    const order = this.orderRepository.create({
      user: { id: userId },
      total,
      paymentMethod,
      items: orderItems,
    });

    return this.orderRepository.save(order);
  }
}
