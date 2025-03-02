import {
  Body,
  Controller,
  Post,
  Get,
  Query,
  HttpCode,
  BadRequestException,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { RegisterTeacherStudentDto } from './dto/register-teacher-student.dto';
import { ParseQueryArrayPipe } from 'src/common/pipes/parse-query-array.pipe';
import { StudentDto } from './dto/student.dto';
import { NotificationDto } from './dto/notification.dto';

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
    if (!teachers.length) {
      throw new BadRequestException("teacher's email is required");
    }

    return this.adminService.getCommonStudents(teachers);
  }

  @Post('suspend')
  @HttpCode(204)
  suspendStudent(@Body() stundentDto: StudentDto) {
    return this.adminService.suspendStudent(stundentDto.student);
  }

  @Post('retrievefornotifications')
  @HttpCode(200)
  retrieveForNotifications(@Body() notificationDto: NotificationDto) {
    return this.adminService.retrieveForNotifications(notificationDto);
  }
}
