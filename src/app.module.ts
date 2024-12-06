import { ConfigModule, ConfigService } from '@nestjs/config';
import { Module, OnModuleInit } from '@nestjs/common';

import { AppController } from './app.controller';
import AppDataSource from '../typeorm.config';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { DataSource } from 'typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { WalletModule } from './wallet/wallet.module';
import { BeneficiaryDetailModule } from './beneficiary-detail/beneficiary-detail.module';
import { TransactionModule } from './transaction/transaction.module';
import { OfframpTransactionModule } from './offramp-transaction/offramp-transaction.module';
import { ExchangeRateThresholdModule } from './exchange-rate-threshold/exchange-rate-threshold.module';
import { AlertModule } from './alert/alert.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async () => {
        const options = { ...AppDataSource.options };
        return options;
      },
    }),
    AuthModule,
    UserModule,
    WalletModule,
    BeneficiaryDetailModule,
    TransactionModule,
    OfframpTransactionModule,
    ExchangeRateThresholdModule,
    AlertModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements OnModuleInit {
  constructor(private dataSource: DataSource) {}

  async onModuleInit() {
    if (this.dataSource.isInitialized) {
      console.log('Database connection has been established successfully.');
    } else {
      console.error('Unable to connect to the database.');
    }
  }
}
