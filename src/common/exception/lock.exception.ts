import { InternalServerErrorException } from '@nestjs/common';

export class OptimisticLockException extends InternalServerErrorException {
  constructor() {
    super('optimistic lock exception');
  }
}
