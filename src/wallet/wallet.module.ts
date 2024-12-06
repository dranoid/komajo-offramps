import { Module } from '@nestjs/common';
import { WalletEntity } from './entities/wallet.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WalletController } from './wallet.controller';
import { WalletService } from './wallet.service';
import { HttpModule } from '@nestjs/axios';
import { BeneficiaryDetailEntity } from 'src/beneficiary-detail/entities/beneficiary-detail.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([WalletEntity, BeneficiaryDetailEntity]),
    HttpModule,
  ],
  controllers: [WalletController],
  providers: [WalletService],
})
export class WalletModule {}
