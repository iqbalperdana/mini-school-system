import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TeacherStudent } from 'src/common/entities/teacher-student.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TeacherStudentRepository extends Repository<TeacherStudent> {
  constructor(
    @InjectRepository(TeacherStudent) repository: Repository<TeacherStudent>,
  ) {
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

  async findCommonStudentsEmailByTeacherEmails(teacherEmails: string[]) {
    const query = this.createQueryBuilder('teacher_student')
      .select('student.email as email')
      .innerJoin('teacher_student.student', 'student')
      .innerJoin('teacher_student.teacher', 'teacher')
      .where('teacher.email IN (:...teacherEmails)', { teacherEmails })
      .groupBy('student.email')
      .having('COUNT(DISTINCT teacher.email) = :teacherEmailsLength', {
        teacherEmailsLength: teacherEmails.length,
      });
    return query.getRawMany();
  }
}
