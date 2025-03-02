import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Student } from 'src/common/entities/student.entity';
import { Teacher } from 'src/common/entities/teacher.entity';
import { TeacherRepository } from './repositories/teacher.repository';
import { StudentRepository } from './repositories/student.repository';
import { TeacherStudentRepository } from './repositories/teacher-student.repository';
import { TeacherStudent } from 'src/common/entities/teacher-student.entity';

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
