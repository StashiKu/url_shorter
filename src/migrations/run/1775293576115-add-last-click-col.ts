import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableIndex,
} from 'typeorm';

export class AddLastClickCol1775293576115 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'url',
      new TableColumn({
        name: 'last_click_at',
        type: 'timestamp',
        isNullable: true,
      }),
    );

    await queryRunner.createIndex(
      'url',
      new TableIndex({
        name: 'idx_urls_last_click_at',
        columnNames: ['last_click_at'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex('urls', 'idx_urls_last_click_at');
    await queryRunner.dropColumn('urls', 'last_click_at');
  }
}
