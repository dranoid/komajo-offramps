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
import { WithdrawDto } from './dto/withdraw.dto';
import { RolesEnum } from '../auth/dto/roles.enum';
import { CurrencyParamDto } from './dto/param.dto';
import { Public } from 'src/auth/public.decorator';

@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Get()
  async getWallets(@Request() req: ExpressRequest) {
    const isAdmin = req['user'].roles.includes(RolesEnum.Admin);
    return this.walletService.getWallets(req['user'].userId, isAdmin);
  }

  @Get(':id')
  async getWallet(@Param('id') id: string, @Request() req: ExpressRequest) {
    const isAdmin = req['user'].roles.includes(RolesEnum.Admin);
    return this.walletService.getWallet(id, req['user'].userId, isAdmin);
  }

  @Get(':currency')
  async getWalletByCurrency(
    @Param() param: CurrencyParamDto,
    @Request() req: ExpressRequest,
  ) {
    const isAdmin = req['user'].roles.includes(RolesEnum.Admin);
    return this.walletService.getWalletByCurrency(
      param.currency,
      req['user'].userId,
      isAdmin,
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

  @Post(':id/withdraw')
  async withdraw(
    @Param('id') id: string,
    @Body() body: WithdrawDto,
    @Request() req: ExpressRequest,
  ) {
    return this.walletService.withdraw(id, body, req['user'].userId);
  }

  @Public()
  @Get('withdrawal-requirements')
  async getWithdrawalRequirements(@Query('countryCode') countryCode: string) {
    return this.walletService.getWithdrawalRequirements(countryCode);
  }
}
