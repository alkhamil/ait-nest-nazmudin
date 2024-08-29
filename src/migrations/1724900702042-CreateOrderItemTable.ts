import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateOrderItemTable1724900702042 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'order_item',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'orderId',
            type: 'int',
          },
          {
            name: 'productId',
            type: 'int',
          },
          {
            name: 'quantity',
            type: 'int',
          },
          {
            name: 'price',
            type: 'decimal',
          },
          {
            name: 'subTotal',
            type: 'decimal',
          },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      'order_item',
      new TableForeignKey({
        columnNames: ['orderId'],
        referencedTableName: 'order',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'order_item',
      new TableForeignKey({
        columnNames: ['productId'],
        referencedTableName: 'product',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('order_item');
  }
}
