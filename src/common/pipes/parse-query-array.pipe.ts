import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class ParseQueryArrayPipe implements PipeTransform {
  constructor(private readonly paramName: string) {}

  transform(value: any) {
    const paramValue = value;

    if (Array.isArray(paramValue)) {
      return paramValue;
    } else if (typeof paramValue === 'string') {
      return [paramValue];
    } else if (paramValue === undefined) {
      return [];
    }

    throw new BadRequestException(`Invalid query parameter: ${this.paramName}`);
  }
}
