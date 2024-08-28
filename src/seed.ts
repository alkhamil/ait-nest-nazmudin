import { NestFactory } from '@nestjs/core';
import { UserService } from './modules/user/user.service';
import { AppModule } from './app.module';
import { CategoryService } from './modules/category/category.service';
import { ProductService } from './modules/product/product.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const categoryService = app.get(CategoryService);
  const productService = app.get(ProductService);
  const userService = app.get(UserService);

  // Seed Categories
  const categories = [
    { name: 'Electronics' },
    { name: 'Clothing' },
    { name: 'Home Appliances' },
  ];

  for (const categoryData of categories) {
    const existingCategory = await categoryService.findOneByName(
      categoryData.name,
    );
    if (!existingCategory) {
      await categoryService.create(categoryData);
    }
  }

  // Users to seed
  const users = [
    { username: 'admin', password: 'adminpass', role: 'admin' },
    { username: 'customer1', password: 'customerpass1', role: 'customer' },
    { username: 'customer2', password: 'customerpass2', role: 'customer' },
  ];

  for (const user of users) {
    const existingUser = await userService.findByUsername(user.username);
    if (!existingUser) {
      await userService.create(user);
    }
  }

  // Seed Products
  const categoriesList = await categoryService.findAll();

  const products = [
    {
      name: 'Smartphone',
      price: 1000,
      categoryId: categoriesList[0].id,
      category: categoriesList[0],
    },
    {
      name: 'T-Shirt',
      price: 2000,
      categoryId: categoriesList[1].id,
      category: categoriesList[1],
    },
    {
      name: 'Washing Machine',
      price: 3000,
      categoryId: categoriesList[2].id,
      category: categoriesList[2],
    },
  ];

  for (const productData of products) {
    const existingProduct = await productService.findByName(productData.name);
    if (!existingProduct) {
      await productService.create(productData);
    }
  }

  await app.close();
}

bootstrap();
