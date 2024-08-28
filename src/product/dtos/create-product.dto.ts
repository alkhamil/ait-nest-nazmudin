import { IsString, IsNumber, IsNotEmpty } from 'class-validator';
import { Category } from 'src/category/category.entity';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  price: number;

  // You can reference the category by its ID
  @IsNotEmpty()
  @IsNumber()
  categoryId: number;

  // Or, you can reference the entire Category object
  category?: Category;
}
