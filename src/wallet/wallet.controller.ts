import { Controller } from '@nestjs/common';
import { WalletService } from './wallet.service';

@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  // @Get()
  // async getWallets(@Request() req: ExpressRequest) {
  //   return this.walletService.getWallets(req['user'].userId, false);
  // }

  // @Get(':id')
  // async getWallet(@Param('id') id: string, @Request() req: ExpressRequest) {
  //   return this.walletService.getWallet(id, req['user'].userId, false);
  // }

  // @Get(':currency')
  // async getWalletByCurrency(
  //   @Param() param: CurrencyParamDto,
  //   @Request() req: ExpressRequest,
  // ) {
  //   return this.walletService.getWalletByCurrency(
  //     param.currency,
  //     req['user'].userId,
  //     false,
  //   );
  // }

  // @Post(':id/deposit')
  // async deposit(
  //   @Param('id') id: string,
  //   @Body() body: DepositDto,
  //   @Request() req: ExpressRequest,
  // ) {
  //   return this.walletService.deposit(id, body, req['user'].userId);
  // }
}
