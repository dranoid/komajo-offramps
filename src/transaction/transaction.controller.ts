import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import {
  CreatePayoutQuoteDto,
  InitializePayoutQuoteDto,
  PayoutDto,
  SingleTransactionDto,
} from './dto/payout.dto';

@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Get('withdrawal-requirements/:countryCode')
  async getWithdrawalRequirements(@Param('countryCode') countryCode: string) {
    return this.transactionService.getWithdrawalRequirements(countryCode);
  }

  @Get('rates')
  async getRates() {
    return this.transactionService.getRates();
  }

  @Get('quote/:quoteId')
  async getQuoteByQuoteId(@Param('quoteId') quoteId: string) {
    return this.transactionService.getQuoteByQuoteId(quoteId);
  }

  @Get('quote/reference/:reference')
  async getQuoteByReference(@Param('reference') reference: string) {
    return this.transactionService.getQuoteByReference(reference);
  }

  @Get('quote/:id')
  async getQuoteById(@Param('id') id: string) {
    return this.transactionService.getQuoteById(id);
  }

  @Post('payouts/quote')
  async getOfframpsQuote(@Body() createPayoutQuoteDto: CreatePayoutQuoteDto) {
    return this.transactionService.getOfframpsQuote(createPayoutQuoteDto);
  }

  @Post('payouts/initialize')
  async initializeOfframpsQuote(
    @Body() initializePayoutQuoteDto: InitializePayoutQuoteDto,
  ) {
    return this.transactionService.initializeOfframpsQuote(
      initializePayoutQuoteDto,
    );
  }

  @Post('payouts/finalize')
  async finalizeOfframpsQuote(@Body('quoteId') quoteId: string) {
    return this.transactionService.finalizeOfframpsQuote(quoteId);
  }

  @Post('send-usdt')
  async sendUSDTToWallet(@Body() payoutDto: PayoutDto) {
    return this.transactionService.sendUSDTToWallet(payoutDto);
  }

  @Get('supported-countries')
  async getSupportedCountries() {
    return this.transactionService.getSupportedCountries();
  }

  @Post('single-transaction')
  async createSingleTransaction(
    @Body() singleTransactionDto: SingleTransactionDto,
  ) {
    return this.transactionService.createSingleTransaction(
      singleTransactionDto,
    );
  }
}
