import { Expose, plainToInstance, Transform } from 'class-transformer';
import { BalanceHistoryDocument } from '../entity/balance.entity';

class FindBalanceHistoryRecordRes {
  @Expose()
  @Transform(({ obj }) => obj._id.toString())
  _id: string;
  @Expose()
  @Transform(({ obj }) => obj.userId.toString())
  userId: string;
  @Expose()
  amount: number;
  @Expose()
  paidDay: Date;

  static of(balanceHistory: BalanceHistoryDocument) {
    return plainToInstance(
      FindBalanceHistoryRecordRes,
      balanceHistory.toObject(),
      {
        excludeExtraneousValues: true,
      },
    );
  }
}

export class FindBalanceHistoryRes {
  data: FindBalanceHistoryRecordRes[];

  static of(balanceHistoryList: BalanceHistoryDocument[]) {
    const obj = new FindBalanceHistoryRes();
    obj.data = balanceHistoryList.map((balanceHistory) => {
      return FindBalanceHistoryRecordRes.of(balanceHistory);
    });
    return obj;
  }
}
