import { Body, Controller, Post, Get, Query, HttpCode } from '@nestjs/common';
import { AdminService } from './admin.service';
import { RegisterTeacherStudentDto } from './dto/register-teacher-student.dto';
import { ParseQueryArrayPipe } from 'src/common/pipes/parse-query-array.pipe';

@Controller('api')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post('register')
  @HttpCode(204)
  registerTeacherStudent(
    @Body() registerTeacherStudentDto: RegisterTeacherStudentDto,
  ) {
    return this.adminService.registerTeacherStudent(registerTeacherStudentDto);
  }

  @Get('commonstudents')
  getCommonStudents(
    @Query('teacher', new ParseQueryArrayPipe('teacher')) teachers: string[],
  ) {
    return this.adminService.getCommonStudents(teachers);
  }
}
