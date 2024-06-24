import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BalanceHistory } from './entity/balance.entity';
import { Model } from 'mongoose';
import { FindBalanceHistoryRes } from './dto/find-balance-history.dto';

@Injectable()
export class BalanceService {
  constructor(
    @InjectModel(BalanceHistory.name)
    private balanceHistoryModel: Model<BalanceHistory>,
  ) {}

  async findHistoryByUserId(userId: string) {
    const balanceHistoryList = await this.balanceHistoryModel.find({ userId });
    return FindBalanceHistoryRes.of(balanceHistoryList);
  }
}
