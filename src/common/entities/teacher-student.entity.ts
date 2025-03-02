import { CreateDateColumn, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { Student } from './student.entity';
import { Teacher } from './teacher.entity';

@Entity('teacher_student')
export class TeacherStudent {
  @PrimaryColumn()
  teacherId: number;

  @PrimaryColumn()
  studentId: number;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Student, (student) => student.teacherStudents)
  student: Student;

  @ManyToOne(() => Teacher, (teacher) => teacher.teacherStudents)
  teacher: Teacher;
}
