import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateProductTable1724897928691 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'product',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'name',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'price',
            type: 'decimal',
            precision: 10,
            scale: 2,
            isNullable: false,
          },
          {
            name: 'categoryId',
            type: 'int',
            isNullable: false,
          },
        ],
      }),
    );

    // Create foreign key constraint for 'categoryId'
    await queryRunner.createForeignKey(
      'product',
      new TableForeignKey({
        columnNames: ['categoryId'],
        referencedColumnNames: ['id'],
        referencedTableName: 'category',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop the foreign key constraint
    const table = await queryRunner.getTable('product');
    const foreignKey = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf('categoryId') !== -1,
    );
    await queryRunner.dropForeignKey('product', foreignKey);

    // Drop the 'product' table
    await queryRunner.dropTable('product');
  }
}
