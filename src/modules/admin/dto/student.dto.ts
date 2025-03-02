import { IsEmail, IsNotEmpty, MaxLength } from 'class-validator';

export class StudentDto {
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(255)
  student: string;
}
