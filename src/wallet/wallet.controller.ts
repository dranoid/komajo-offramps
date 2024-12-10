import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Request,
} from '@nestjs/common';
import { WalletService } from './wallet.service';
import { Request as ExpressRequest } from 'express';
import { DepositDto } from './dto/deposit.dto';
import { CurrencyParamDto } from './dto/param.dto';

@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Get()
  async getWallets(@Request() req: ExpressRequest) {
    return this.walletService.getWallets(req['user'].userId, false);
  }

  @Get(':id')
  async getWallet(@Param('id') id: string, @Request() req: ExpressRequest) {
    return this.walletService.getWallet(id, req['user'].userId, false);
  }

  @Get(':currency')
  async getWalletByCurrency(
    @Param() param: CurrencyParamDto,
    @Request() req: ExpressRequest,
  ) {
    return this.walletService.getWalletByCurrency(
      param.currency,
      req['user'].userId,
      false,
    );
  }

  @Post(':id/deposit')
  async deposit(
    @Param('id') id: string,
    @Body() body: DepositDto,
    @Request() req: ExpressRequest,
  ) {
    return this.walletService.deposit(id, body, req['user'].userId);
  }

  // @Post(':id/withdraw')
  // async withdraw(
  //   @Param('id') id: string,
  //   @Body() body: WithdrawDto,
  //   @Request() req: ExpressRequest,
  // ) {
  //   return this.walletService.initiateWithdraw(id, body, req['user'].userId);
  // }

  @Get('withdrawal-requirements')
  async getWithdrawalRequirements(@Query('countryCode') countryCode: string) {
    return this.walletService.getWithdrawalRequirements(countryCode);
  }

  @Get('rates')
  async getRates() {
    return this.walletService.getRates();
  }
}
