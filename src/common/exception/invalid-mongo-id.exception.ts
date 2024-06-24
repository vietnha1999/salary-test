import { BadRequestException } from '@nestjs/common';

export class InvalidMongoIdException extends BadRequestException {
  constructor() {
    super('invalid mongo id');
  }
}
