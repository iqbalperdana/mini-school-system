import {
  IsNotEmpty,
  IsString,
  IsArray,
  IsEmail,
  MaxLength,
} from 'class-validator';

export class RegisterTeacherStudentDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @MaxLength(255)
  teacher: string;

  @IsArray()
  students: string[];
}
