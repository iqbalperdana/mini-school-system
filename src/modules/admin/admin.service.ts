import { Injectable } from '@nestjs/common';
import { RegisterTeacherStudentDto } from './dto/register-teacher-student.dto';
import { TeacherRepository } from './repositories/teacher.repository';
import { StudentRepository } from './repositories/student.repository';
import { TeacherStudentRepository } from './repositories/teacher-student.repository';
import { In } from 'typeorm';

@Injectable()
export class AdminService {
  constructor(
    private readonly teacherRepository: TeacherRepository,
    private readonly studentRepository: StudentRepository,
    private readonly teacherStudentRepository: TeacherStudentRepository,
  ) {}

  async registerTeacherStudent(
    registerTeacherStudentDto: RegisterTeacherStudentDto,
  ) {
    try {
      let existingTeacher = await this.teacherRepository.findOne({
        where: { email: registerTeacherStudentDto.teacher },
        relations: {
          teacherStudents: {
            student: true,
          },
        },
      });

      if (!existingTeacher) {
        existingTeacher = await this.teacherRepository.save({
          email: registerTeacherStudentDto.teacher,
        });
      }

      // Check whether has inserted new students
      const existingStudents = await this.studentRepository.find({
        where: { email: In(registerTeacherStudentDto.students) },
      });

      const existingStudentEmails = existingStudents.map(
        (student) => student.email,
      );

      registerTeacherStudentDto.students =
        registerTeacherStudentDto.students.filter(
          (student) => !existingStudentEmails.includes(student),
        );

      const students = await this.studentRepository.save(
        registerTeacherStudentDto.students.map((student) => ({
          email: student,
        })),
      );

      // Need to pair the existing student as well as the new students
      const studentsToAdd = [...existingStudents, ...students];
      if (studentsToAdd.length) {
        await this.teacherStudentRepository.addStudentRelationship(
          existingTeacher.id,
          studentsToAdd.map((student) => student.id),
        );
      }
    } catch (error) {
      console.log(error);
    }
  }
}
