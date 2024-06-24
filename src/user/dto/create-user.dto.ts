import { PartialType } from '@nestjs/swagger';
import { UserType } from '../user.type';
import { UserDocument } from '../entity/user.entity';
import { Expose, plainToInstance, Transform } from 'class-transformer';

export class CreateUserReq {
  @Expose()
  type: UserType;
  @Expose()
  salary: number;
}

export class CreateUserRes extends PartialType(CreateUserReq) {
  @Expose()
  @Transform(({ obj }) => obj._id.toString())
  _id: string;
  @Expose()
  balance: number;

  static of(user: UserDocument) {
    return plainToInstance(CreateUserRes, user.toObject(), {
      excludeExtraneousValues: true,
    });
  }
}
