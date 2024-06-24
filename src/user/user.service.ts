import { Injectable } from '@nestjs/common';
import { CreateUserReq, CreateUserRes } from './dto/create-user.dto';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { User } from './entity/user.entity';
import { Connection, Model } from 'mongoose';
import { FindUserRes } from './dto/find-user.dto';
import { MongooseService } from '../common/service/mongoose.service';
import { UserType } from './user.type';
import { BalanceHistory } from '../balance/entity/balance.entity';
import { OptimisticLockException } from '../common/exception/lock.exception';
import { UserNotFoundException } from '../common/exception/user.exception';

@Injectable()
export class UserService extends MongooseService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectModel(BalanceHistory.name)
    private balanceHistoryModel: Model<BalanceHistory>,
    @InjectConnection() private connection: Connection,
  ) {
    super();
  }

  async create(createUserReq: CreateUserReq) {
    const user = await this.withTransaction(
      this.connection,
      undefined,
      async (session) => {
        const userList = await this.userModel.create(
          [
            {
              type: createUserReq.type,
              salary: createUserReq.salary,
              balance: 0,
              v: 0,
              createdAt: new Date(),
            },
          ],
          { session },
        );
        const user = userList[0];
        await this.balanceHistoryModel.create(
          [
            {
              userId: user.id,
              amount: 0,
              paidDay: new Date(),
            },
          ],
          { session },
        );
        return user;
      },
    );

    return CreateUserRes.of(user);
  }

  async findOne(id: string) {
    const user = await this.updateLatestBalance(id);
    return FindUserRes.of(user);
  }

  async updateLatestBalance(id: string, currentDate: Date = new Date()) {
    const user = await this.withTransaction(
      this.connection,
      undefined,
      async (session) => {
        const user = await this.userModel.findById(id, undefined, { session });
        if (!user) {
          throw new UserNotFoundException();
        }

        const previousDate = new Date(currentDate);
        previousDate.setDate(currentDate.getDate() - 1);
        if (user.createdAt.getTime() > previousDate.getTime()) {
          return user;
        }

        const balanceHistory = await this.balanceHistoryModel.findOne(
          {
            userId: user.id,
            paidDay: {
              $lt: currentDate,
              $gte: previousDate,
            },
          },
          undefined,
          { session },
        );
        if (balanceHistory) {
          return user;
        }

        let amount: number = user.salary;
        if (user.type === UserType.MONTHLY) {
          amount = user.salary / 30;
        } else if (user.type === UserType.DAILY) {
          amount = user.salary;
        }
        await this.balanceHistoryModel.create(
          [
            {
              userId: user.id,
              amount,
              paidDay: currentDate,
            },
          ],
          { session },
        );

        const userAfterUpdated = await this.userModel.findOneAndUpdate(
          {
            _id: user.id,
            v: user.v,
          },
          {
            balance: user.balance + amount,
            v: user.v + 1,
          },
          {
            session,
            returnDocument: 'after',
          },
        );
        if (!userAfterUpdated) {
          throw new OptimisticLockException();
        }
        return userAfterUpdated;
      },
    );
    return user;
  }

  async updateLatestBalanceForAllUsers(currentDate: Date) {
    const cursor = this.userModel
      .find({ salary: { $gt: 0 } })
      .cursor({ batchSize: 1000 });
    await cursor.eachAsync(
      async (user) => {
        await this.updateLatestBalance(user.id, currentDate);
      },
      { parallel: 10, continueOnError: true },
    );
  }
}
