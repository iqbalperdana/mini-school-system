import { IsEmail, IsNotEmpty } from 'class-validator';

export class StudentDto {
  @IsNotEmpty()
  @IsEmail()
  student: string;
}
