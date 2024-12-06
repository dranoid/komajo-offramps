import { Module } from '@nestjs/common';
import { BeneficiaryDetailEntity } from './entities/beneficiary-detail.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([BeneficiaryDetailEntity])],
})
export class BeneficiaryDetailModule {}
