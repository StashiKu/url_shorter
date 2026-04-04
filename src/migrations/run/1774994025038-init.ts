import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class Run1774994025038 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'url',
        columns: [
          {
            name: 'id',
            type: 'serial',
            isPrimary: true,
          },
          {
            name: 'original_url',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'short_code',
            type: 'varchar',
            length: '10',
            isUnique: true,
            isNullable: false,
          },
          {
            name: 'clicks',
            type: 'integer',
            default: 0,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
    );

    console.log('Table is created');

    await queryRunner.createIndex(
      'url',
      new TableIndex({
        name: 'idx_url_short_code',
        columnNames: ['short_code'],
      }),
    );

    console.log('Index is created');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('url', true);
  }
}
