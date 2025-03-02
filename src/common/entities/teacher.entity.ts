import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { TeacherStudent } from './teacher-student.entity';

@Entity('teacher')
export class Teacher {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ unique: true })
  email: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => TeacherStudent, (teacherStudent) => teacherStudent.teacher)
  teacherStudents: TeacherStudent[];
}
