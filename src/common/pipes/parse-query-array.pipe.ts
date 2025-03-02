import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { isEmail } from 'class-validator';

@Injectable()
export class ParseQueryArrayPipe implements PipeTransform {
  constructor(private readonly paramName: string) {}

  transform(value: any) {
    const paramValue = value;

    let emails: string[];
    if (Array.isArray(paramValue)) {
      emails = paramValue;
    } else if (typeof paramValue === 'string') {
      emails = [paramValue];
    } else if (paramValue === undefined) {
      emails = [];
    } else {
      throw new BadRequestException(
        `Invalid query parameter: ${this.paramName}`,
      );
    }

    for (const email of emails) {
      if (!isEmail(email)) {
        throw new BadRequestException(`Invalid email: ${email}`);
      }
    }

    return emails;
  }
}
