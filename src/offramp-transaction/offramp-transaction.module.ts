import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OfframpTransactionEntity } from './entities/offramp-transaction.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OfframpTransactionEntity])],
})
export class OfframpTransactionModule {}
