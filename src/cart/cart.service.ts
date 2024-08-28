import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/user.entity';
import { Product } from '../product/product.entity';
import { Cart } from './cart.entity';
import { OrderService } from '../order/order.service';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    private orderService: OrderService,
  ) {}

  async addToCart(
    userId: number,
    productId: number,
    quantity: number,
  ): Promise<Cart> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    const product = await this.productRepository.findOne({
      where: { id: productId },
    });

    if (!user || !product) {
      throw new HttpException(
        'User or Product not found',
        HttpStatus.NOT_FOUND,
      );
    }

    let cart = await this.cartRepository.findOne({
      where: { user: { id: userId }, product: { id: productId } },
    });
    if (cart) {
      cart.quantity += quantity;
    } else {
      cart = this.cartRepository.create({ user, product, quantity });
    }

    return this.cartRepository.save(cart);
  }

  async listCartItems(userId: number): Promise<Cart[]> {
    return this.cartRepository.find({
      where: { user: { id: userId } },
      relations: ['product'],
    });
  }

  async checkout(
    userId: number,
    paymentMethod: string,
  ): Promise<{ message: string }> {
    const cartItems = await this.listCartItems(userId);
    if (cartItems.length === 0) {
      throw new HttpException('Cart is empty', HttpStatus.NOT_FOUND);
    }

    await this.orderService.createOrder(cartItems, userId, paymentMethod);
    await this.cartRepository.delete({ user: { id: userId } });

    return { message: 'Checkout successful' };
  }
}
