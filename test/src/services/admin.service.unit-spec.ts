import { Test, TestingModule } from '@nestjs/testing';
import { AdminService } from '../../../src/modules/admin/admin.service';
import { TeacherRepository } from '../../../src/modules/admin/repositories/teacher.repository';
import { StudentRepository } from '../../../src/modules/admin/repositories/student.repository';
import { TeacherStudentRepository } from '../../../src/modules/admin/repositories/teacher-student.repository';
import { Student } from '../../../src/common/entities/student.entity';
import { Teacher } from '../../../src/common/entities/teacher.entity';
import { HttpException } from '@nestjs/common/exceptions/http.exception';
import { HttpStatus } from '@nestjs/common';

describe('AdminService', () => {
  let service;
  let teacherRepositoryMock;
  let studentRepositoryMock;
  let teacherStudentRepositoryMock;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminService,
        {
          provide: TeacherRepository,
          useValue: {
            findOne: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: StudentRepository,
          useValue: {
            find: jest.fn(),
            findOneBy: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: TeacherStudentRepository,
          useValue: {
            addStudentRelationship: jest.fn(),
            findCommonStudentsEmailByTeacherEmails: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AdminService>(AdminService);
    teacherRepositoryMock = module.get<TeacherRepository>(TeacherRepository);
    studentRepositoryMock = module.get<StudentRepository>(StudentRepository);
    teacherStudentRepositoryMock = module.get<TeacherStudentRepository>(
      TeacherStudentRepository,
    );
  });

  describe('registerTeacherStudent', () => {
    const registerDto = {
      teacher: 'teacher@example.com',
      students: ['student1@example.com', 'student2@example.com'],
    };

    const teacher = new Teacher();
    teacher.id = 1;
    teacher.email = 'teacher@example.com';

    const student1 = new Student();
    student1.id = 33;
    student1.email = 'student1@example.com';

    const student2 = new Student();
    student2.id = 34;
    student2.email = 'student2@example.com';

    it('should register new teacher and students', async () => {
      jest.spyOn(teacherRepositoryMock, 'findOne').mockResolvedValueOnce(null);
      jest.spyOn(teacherRepositoryMock, 'save').mockResolvedValueOnce(teacher);
      jest.spyOn(studentRepositoryMock, 'find').mockResolvedValueOnce([]);
      jest
        .spyOn(studentRepositoryMock, 'save')
        .mockResolvedValueOnce([student1, student2]);
      jest
        .spyOn(teacherStudentRepositoryMock, 'addStudentRelationship')
        .mockResolvedValueOnce(undefined);

      await service.registerTeacherStudent(registerDto);

      expect(teacherRepositoryMock.save).toHaveBeenCalled();
      expect(studentRepositoryMock.save).toHaveBeenCalled();
      expect(
        teacherStudentRepositoryMock.addStudentRelationship,
      ).toHaveBeenCalled();
      expect(
        teacherStudentRepositoryMock.addStudentRelationship,
      ).toHaveBeenCalledWith(teacher.id, [student1.id, student2.id]);
    });

    it('should not create a new teacher if it already exists', async () => {
      jest
        .spyOn(teacherRepositoryMock, 'findOne')
        .mockResolvedValueOnce(teacher);
      jest.spyOn(studentRepositoryMock, 'find').mockResolvedValueOnce([]);
      jest
        .spyOn(studentRepositoryMock, 'save')
        .mockResolvedValueOnce([student1, student2]);
      jest
        .spyOn(teacherStudentRepositoryMock, 'addStudentRelationship')
        .mockResolvedValueOnce(undefined);

      await service.registerTeacherStudent(registerDto);

      expect(teacherRepositoryMock.save).not.toHaveBeenCalled();
    });

    it('should not create new students if they already exist', async () => {
      jest
        .spyOn(teacherRepositoryMock, 'findOne')
        .mockResolvedValueOnce(teacher);
      jest
        .spyOn(studentRepositoryMock, 'find')
        .mockResolvedValueOnce([student1, student2]);
      jest
        .spyOn(studentRepositoryMock, 'save')
        .mockResolvedValueOnce([student1, student2]);
      jest
        .spyOn(teacherStudentRepositoryMock, 'addStudentRelationship')
        .mockResolvedValueOnce(undefined);

      await service.registerTeacherStudent(registerDto);
      expect(studentRepositoryMock.save).not.toHaveBeenCalled();
    });

    it('should pair all students with the teacher, with 1 new student', async () => {
      registerDto.students.push('student3@example.com');
      const student3 = new Student();
      student3.id = 35;
      student3.email = 'student3@example.com';

      jest
        .spyOn(teacherRepositoryMock, 'findOne')
        .mockResolvedValueOnce(teacher);
      jest
        .spyOn(studentRepositoryMock, 'find')
        .mockResolvedValueOnce([student1, student2]);
      jest.spyOn(studentRepositoryMock, 'save').mockResolvedValueOnce(student3);
      jest
        .spyOn(teacherStudentRepositoryMock, 'addStudentRelationship')
        .mockResolvedValueOnce(undefined);

      await service.registerTeacherStudent(registerDto);

      expect(
        teacherStudentRepositoryMock.addStudentRelationship,
      ).toHaveBeenCalledWith(teacher.id, [
        student1.id,
        student2.id,
        student3.id,
      ]);
    });

    it('should pair all students with the teacher, with more than 1 new student', async () => {
      registerDto.students.push('student3@example.com', 'student4@example.com');
      const student3 = new Student();
      student3.id = 35;
      student3.email = 'student3@example.com';

      const student4 = new Student();
      student4.id = 36;
      student4.email = 'student4@example.com';

      jest
        .spyOn(teacherRepositoryMock, 'findOne')
        .mockResolvedValueOnce(teacher);
      jest
        .spyOn(studentRepositoryMock, 'find')
        .mockResolvedValueOnce([student1, student2]);
      jest
        .spyOn(studentRepositoryMock, 'save')
        .mockResolvedValueOnce([student3, student4]);
      jest
        .spyOn(teacherStudentRepositoryMock, 'addStudentRelationship')
        .mockResolvedValueOnce(undefined);

      await service.registerTeacherStudent(registerDto);

      expect(
        teacherStudentRepositoryMock.addStudentRelationship,
      ).toHaveBeenCalledWith(teacher.id, [
        student1.id,
        student2.id,
        student3.id,
        student4.id,
      ]);
    });

    it('should create a new teacher even when students empty', async () => {
      registerDto.students = [];
      jest.spyOn(teacherRepositoryMock, 'findOne').mockResolvedValueOnce(null);
      jest.spyOn(teacherRepositoryMock, 'save').mockResolvedValueOnce(teacher);

      await service.registerTeacherStudent(registerDto);

      expect(teacherRepositoryMock.save).toHaveBeenCalled();
      expect(studentRepositoryMock.find).not.toHaveBeenCalled();
      expect(studentRepositoryMock.save).not.toHaveBeenCalled();
      expect(
        teacherStudentRepositoryMock.addStudentRelationship,
      ).not.toHaveBeenCalled();
    });
  });

  describe('getCommonStudents', () => {
    it('should return common students for given teachers', async () => {
      const teacherEmails = ['teacher1@example.com', 'teacher2@example.com'];
      const mockStudents = [{ email: 'student@example.com' }];

      jest
        .spyOn(
          teacherStudentRepositoryMock,
          'findCommonStudentsEmailByTeacherEmails',
        )
        .mockResolvedValue(mockStudents);

      const result = await service.getCommonStudents(teacherEmails);

      expect(result).toEqual(['student@example.com']);
    });

    it('should return empty array when no common students found', async () => {
      const teacherEmails = ['teacher1@example.com', 'teacher2@example.com'];
      const mockStudents = [];
      jest
        .spyOn(
          teacherStudentRepositoryMock,
          'findCommonStudentsEmailByTeacherEmails',
        )
        .mockResolvedValue(mockStudents);
      const result = await service.getCommonStudents(teacherEmails);
      expect(result).toEqual([]);
    });

    it('should throw exception when no teacher emails given', async () => {
      const teacherEmails: string[] = [];
      try {
        await service.getCommonStudents(teacherEmails);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.message).toBe('Teacher emails is required');
        expect(error.status).toBe(HttpStatus.BAD_REQUEST);
      }
    });
  });

  describe('suspendStudent', () => {
    const student1 = new Student();
    student1.id = 33;
    student1.email = 'student1@example.com';

    it('should suspend a student', async () => {
      const studentEmail = student1.email;
      student1.status = 'active';

      jest
        .spyOn(studentRepositoryMock, 'findOneBy')
        .mockResolvedValue(student1);
      jest.spyOn(studentRepositoryMock, 'save').mockResolvedValue({
        ...student1,
        status: 'suspend',
      });

      await service.suspendStudent(studentEmail);

      expect(studentRepositoryMock.findOneBy).toHaveBeenCalledWith({
        email: studentEmail,
      });
      expect(studentRepositoryMock.save).toHaveBeenCalledWith({
        ...student1,
        status: 'suspend',
      });
    });

    it('should throw an error if student not found', async () => {
      const studentEmail = 'nonexistent@example.com';
      jest.spyOn(studentRepositoryMock, 'findOneBy').mockResolvedValue(null);
      try {
        await service.suspendStudent(studentEmail);
      } catch (error) {
        expect(error).toBeInstanceOf(HttpException);
        expect(error.message).toBe(`Student ${studentEmail} not found`);
        expect(error.status).toBe(HttpStatus.NOT_FOUND);
      }
    });
  });
});
