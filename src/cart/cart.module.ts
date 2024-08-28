import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from './cart.entity';
import { User } from 'src/user/user.entity';
import { Product } from 'src/product/product.entity';
import { OrderModule } from 'src/order/order.module';
import { RolesGuard } from 'src/auth/roles.guard';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Module({
  imports: [TypeOrmModule.forFeature([Cart, User, Product]), OrderModule],
  providers: [CartService, RolesGuard, JwtAuthGuard],
  controllers: [CartController],
})
export class CartModule {}
