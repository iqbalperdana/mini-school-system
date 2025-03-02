import { Injectable } from '@nestjs/common';
import { In, Repository } from 'typeorm';
import { Student } from '../../../common/entities/student.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class StudentRepository extends Repository<Student> {
  constructor(@InjectRepository(Student) repository: Repository<Student>) {
    super(repository.target, repository.manager, repository.queryRunner);
  }

  async findAllStudentIdsByEmail(emails: string[]) {
    return await this.find({
      select: ['id', 'email'],
      where: { email: In(emails) },
    });
  }

  async findAllActiveStudentsByEmails(emails: string[]) {
    return await this.createQueryBuilder('student')
      .select('student.email as email')
      .where('student.email IN (:...emails)', { emails })
      .andWhere('student.status = :status', { status: 'active' })
      .getRawMany();
  }
}
