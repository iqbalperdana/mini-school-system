import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class NotificationDto {
  @IsEmail()
  @IsNotEmpty()
  teacher: string;

  @IsString()
  @IsNotEmpty()
  notification: string;
}
