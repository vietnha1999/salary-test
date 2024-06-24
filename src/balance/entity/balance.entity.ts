import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';

export type BalanceHistoryDocument = mongoose.HydratedDocument<BalanceHistory>;

@Schema({
  versionKey: false,
  timestamps: false,
})
export class BalanceHistory {
  @Prop({ type: mongoose.Schema.Types.ObjectId })
  userId: mongoose.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.Date })
  paidDay: Date;

  @Prop({ type: mongoose.Schema.Types.Number })
  amount: number;
}

export const BalanceHistorySchema =
  SchemaFactory.createForClass(BalanceHistory);
BalanceHistorySchema.index({
  userId: -1,
  paidDay: -1,
});
