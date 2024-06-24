import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';
import * as mongoose from 'mongoose';
import { InvalidMongoIdException } from '../exception/invalid-mongo-id.exception';

@Injectable()
export class ParseObjectIdPipe
  implements PipeTransform<any, mongoose.Types.ObjectId>
{
  transform(
    value: string | undefined | null,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _: ArgumentMetadata,
  ): mongoose.Types.ObjectId {
    if (!value || !mongoose.isObjectIdOrHexString(value)) {
      throw new InvalidMongoIdException();
    }

    return new mongoose.Types.ObjectId(value);
  }
}
