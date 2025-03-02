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
}
