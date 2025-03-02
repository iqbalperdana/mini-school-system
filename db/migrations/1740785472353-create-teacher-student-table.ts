import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTeacherStudent1740785472353 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS teacher_student (
                teacher_id INT NOT NULL,
                student_id INT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (teacher_id, student_id),
                FOREIGN KEY (teacher_id) REFERENCES teacher(id),
                FOREIGN KEY (student_id) REFERENCES student(id)
            )
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP TABLE IF EXISTS teacher_student
        `);
  }
}
