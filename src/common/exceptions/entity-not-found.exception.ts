import { HttpException, HttpStatus } from '@nestjs/common';

const DEFAULT_MESSAGE = 'Entity not found';

export class EntityNotFoundException extends HttpException {
  constructor(message: string = DEFAULT_MESSAGE) {
    super(message, HttpStatus.NOT_FOUND);
  }
}
