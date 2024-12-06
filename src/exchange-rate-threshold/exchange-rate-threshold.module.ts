import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExchangeRateThresholdEntity } from './entities/exchange-rate-threshold.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ExchangeRateThresholdEntity])],
})
export class ExchangeRateThresholdModule {}
