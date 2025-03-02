import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TeacherStudent } from './teacher-student.entity';

export type StudentStatus = 'active' | 'inactive' | 'suspend';

@Entity('student')
export class Student {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column()
  email: string;

  @Column({
    type: 'enum',
    enum: ['active', 'inactive', 'suspend'],
    default: 'active',
  })
  status: StudentStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => TeacherStudent, (teacherStudent) => teacherStudent.student)
  teacherStudents: TeacherStudent[];
}
