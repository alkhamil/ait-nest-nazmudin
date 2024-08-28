import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  HttpException,
  Req,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { Cart } from './cart.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';

@Controller('cart')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Roles('customer')
  @Post('add')
  async addToCart(
    @Body('productId') productId: number,
    @Body('quantity') quantity: number,
    @Req() req: Request,
  ): Promise<Cart> {
    try {
      const user = req['user'];
      return this.cartService.addToCart(user.userId, productId, quantity);
    } catch (error) {
      throw new HttpException(
        error.message || 'An unexpected error occurred.',
        error.status,
      );
    }
  }

  @Roles('customer')
  @Get()
  async listCartItems(@Req() req: Request): Promise<Cart[]> {
    const user = req['user'];
    return this.cartService.listCartItems(user.userId);
  }

  @Roles('customer')
  @Post('checkout')
  async checkout(
    @Body('paymentMethod') paymentMethod: string,
    @Req() req: Request,
  ): Promise<{ message: string }> {
    try {
      const user = req['user'];
      return this.cartService.checkout(user.userId, paymentMethod);
    } catch (error) {
      throw new HttpException(
        error.message || 'An unexpected error occurred.',
        error.status,
      );
    }
  }
}
