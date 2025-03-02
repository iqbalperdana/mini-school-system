import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Teacher } from '../../../common/entities/teacher.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TeacherRepository extends Repository<Teacher> {
  constructor(@InjectRepository(Teacher) repository: Repository<Teacher>) {
    super(repository.target, repository.manager, repository.queryRunner);
  }

  async addStudentRelationship(
    existingTeacherId: number,
    existingStudentIds: number[],
  ) {
    const values = existingStudentIds.map((existingStudentId) => ({
      teacher: {
        id: existingTeacherId,
      },
      student: {
        id: existingStudentId,
      },
    }));
    await this.createQueryBuilder()
      .insert()
      .into('teacher_student')
      .values(values)
      .orIgnore()
      .execute();
  }
}
