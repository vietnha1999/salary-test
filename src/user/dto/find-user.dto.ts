import { PartialType } from '@nestjs/swagger';
import { UserDocument } from '../entity/user.entity';
import { CreateUserRes } from './create-user.dto';
import { plainToInstance } from 'class-transformer';

export class FindUserRes extends PartialType(CreateUserRes) {
  static of(user: UserDocument) {
    return plainToInstance(FindUserRes, user.toObject(), {
      excludeExtraneousValues: true,
    });
  }
}
