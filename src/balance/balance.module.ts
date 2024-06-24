import { Module } from '@nestjs/common';
import { BalanceService } from './balance.service';
import { BalanceController } from './balance.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { BalanceHistory, BalanceHistorySchema } from './entity/balance.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: BalanceHistory.name, schema: BalanceHistorySchema },
    ]),
  ],
  controllers: [BalanceController],
  providers: [BalanceService],
})
export class BalanceModule {}
