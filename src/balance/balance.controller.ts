import { Controller, Get, Param, UseInterceptors } from '@nestjs/common';
import { BalanceService } from './balance.service';
import { ParseObjectIdPipe } from '../common/pipe/ParseObjectIdPipe';
import { FindBalanceHistoryRes } from './dto/find-balance-history.dto';
import { ApiTags } from '@nestjs/swagger';
import { CacheInterceptor } from '@nestjs/cache-manager';

@Controller('balance')
@UseInterceptors(CacheInterceptor)
@ApiTags('balance')
export class BalanceController {
  constructor(private readonly balanceService: BalanceService) {}

  @Get(':userId/history')
  async findOne(
    @Param('userId', ParseObjectIdPipe) userId: string,
  ): Promise<FindBalanceHistoryRes> {
    return await this.balanceService.findHistoryByUserId(userId);
  }
}
