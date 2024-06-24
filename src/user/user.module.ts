import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User, UserSchema } from './entity/user.entity';
import { MongooseModule } from '@nestjs/mongoose';
import {
  BalanceHistory,
  BalanceHistorySchema,
} from '../balance/entity/balance.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([
      { name: BalanceHistory.name, schema: BalanceHistorySchema },
    ]),
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
