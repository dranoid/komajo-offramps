import { ConfigModule } from '@nestjs/config';
import { Module, OnModuleInit } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WalletModule } from './wallet/wallet.module';
import { TransactionModule } from './transaction/transaction.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    WalletModule,
    TransactionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements OnModuleInit {
  constructor() {}

  async onModuleInit() {
    console.log('Module has been initialized.');
  }
}
