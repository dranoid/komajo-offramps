import { Module } from '@nestjs/common';
import { WalletEntity } from './entities/wallet.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WalletController } from './wallet.controller';
import { WalletService } from './wallet.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [TypeOrmModule.forFeature([WalletEntity]), HttpModule],
  controllers: [WalletController],
  providers: [WalletService],
})
export class WalletModule {}
