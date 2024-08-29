import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateCartTable1724898067303 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'cart',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'userId',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'productId',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'quantity',
            type: 'int',
            isNullable: false,
          },
        ],
      }),
    );

    // Create foreign key constraint for 'userId'
    await queryRunner.createForeignKey(
      'cart',
      new TableForeignKey({
        columnNames: ['userId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user',
        onDelete: 'CASCADE',
      }),
    );

    // Create foreign key constraint for 'productId'
    await queryRunner.createForeignKey(
      'cart',
      new TableForeignKey({
        columnNames: ['productId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'product',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop foreign key constraints
    const table = await queryRunner.getTable('cart');
    const foreignKeyUser = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('userId') !== -1,
    );
    const foreignKeyProduct = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('productId') !== -1,
    );
    await queryRunner.dropForeignKey('cart', foreignKeyUser);
    await queryRunner.dropForeignKey('cart', foreignKeyProduct);

    // Drop the 'cart' table
    await queryRunner.dropTable('cart');
  }
}
