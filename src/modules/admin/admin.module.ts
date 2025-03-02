import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Student } from '../../../src/common/entities/student.entity';
import { Teacher } from '../../../src/common/entities/teacher.entity';
import { TeacherRepository } from '../../common/repositories/teacher.repository';
import { StudentRepository } from '../../common/repositories/student.repository';
import { TeacherStudentRepository } from '../../common/repositories/teacher-student.repository';
import { TeacherStudent } from '../../../src/common/entities/teacher-student.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Student, Teacher, TeacherStudent])],
  controllers: [AdminController],
  providers: [
    AdminService,
    TeacherRepository,
    StudentRepository,
    TeacherStudentRepository,
  ],
})
export class AdminModule {}
