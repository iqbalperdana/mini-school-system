import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { RegisterTeacherStudentDto } from './dto/register-teacher-student.dto';
import { TeacherRepository } from './repositories/teacher.repository';
import { StudentRepository } from './repositories/student.repository';
import { TeacherStudentRepository } from './repositories/teacher-student.repository';
import { In } from 'typeorm';
import { StudentStatus } from '../../common/entities/student.entity';
import { EntityNotFoundException } from '../../common/exceptions/entity-not-found.exception';

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

      if (registerTeacherStudentDto.students.length == 0) {
        return;
      }

      // Check whether has inserted new students
      const existingStudents = await this.studentRepository.find({
        where: { email: In(registerTeacherStudentDto.students) },
      });

      const existingStudentEmails = existingStudents.map(
        (student) => student.email,
      );

      // Filter from existing students
      registerTeacherStudentDto.students =
        registerTeacherStudentDto.students.filter(
          (student) => !existingStudentEmails.includes(student),
        );

      let students = [];
      const numOfNewStudents = registerTeacherStudentDto.students.length;
      if (numOfNewStudents > 0) {
        const newStudents = await this.studentRepository.save(
          registerTeacherStudentDto.students.map((student) => ({
            email: student,
          })),
        );

        if (numOfNewStudents == 1) {
          students.push(newStudents);
        } else {
          students = newStudents;
        }
      }

      // Need to pair the existing student as well as the new students
      const studentsToAdd = [...existingStudents, ...students];
      if (studentsToAdd.length) {
        await this.teacherStudentRepository.addStudentRelationship(
          existingTeacher.id,
          studentsToAdd.map((student) => student.id),
        );
      }
    } catch (error) {
      throw error.status == undefined
        ? new InternalServerErrorException()
        : new HttpException(error.message, error.status);
    }
  }

  async getCommonStudents(teacherEmails: string[]) {
    try {
      if (!teacherEmails || teacherEmails.length == 0) {
        throw new BadRequestException('Teacher emails is required');
      }

      const commonStudents =
        await this.teacherStudentRepository.findCommonStudentsEmailByTeacherEmails(
          teacherEmails,
        );
      return commonStudents.flatMap((student) => student.email);
    } catch (error) {
      throw error.status == undefined
        ? new InternalServerErrorException()
        : new HttpException(error.message, error.status);
    }
  }

  async suspendStudent(studentEmail: string) {
    try {
      const student = await this.studentRepository.findOneBy({
        email: studentEmail,
      });

      if (!student) {
        throw new EntityNotFoundException(`Student ${studentEmail} not found`);
      }

      student.status = 'suspend' as StudentStatus;
      await this.studentRepository.save(student);
    } catch (error) {
      throw error.status == undefined
        ? new InternalServerErrorException()
        : new HttpException(error.message, error.status);
    }
  }
}
