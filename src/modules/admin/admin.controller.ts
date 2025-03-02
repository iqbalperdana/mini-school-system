import { Body, Controller, Post, HttpCode } from '@nestjs/common';
import { AdminService } from './admin.service';
import { RegisterTeacherStudentDto } from './dto/register-teacher-student.dto';

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
}
