import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import {
  CreatePayoutQuoteDto,
  InitializePayoutQuoteDto,
  PayoutDto,
  SingleTransactionDto,
} from './dto/payout.dto';

@Injectable()
export class TransactionService {
  constructor(private readonly httpService: HttpService) {}

  async getWithdrawalRequirements(countryCode: string) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(
          `${process.env.NOBBLET_BASE_URL}/payouts/supported-countries-requirement/${countryCode}`,
          {
            headers: {
              Authorization: `Bearer ${process.env.NOBBLET_SECRET_KEY}`,
            },
          },
        ),
      );
      return response.data;
    } catch (error) {
      throw new BadRequestException(error.response.data);
    }
  }

  async getSupportedCountries() {
    try {
      const response = await firstValueFrom(
        this.httpService.get(
          `${process.env.NOBBLET_BASE_URL}/payouts/supported-countries`,
          {
            headers: {
              Authorization: `Bearer ${process.env.NOBBLET_SECRET_KEY}`,
            },
          },
        ),
      );
      return response.data;
    } catch (error) {
      throw new BadRequestException(error.response.data);
    }
  }

  async getRates() {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${process.env.NOBBLET_BASE_URL}/payouts/limits`, {
          headers: {
            Authorization: `Bearer ${process.env.NOBBLET_SECRET_KEY}`,
          },
        }),
      );
      return response.data.data.map((limit: any) => {
        return {
          rate: limit.rate,
          currency: limit.currency,
          country: limit.country,
        };
      });
    } catch (error) {
      throw new BadRequestException(error.response.data);
    }
  }

  async getQuoteByQuoteId(quoteId: string) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(
          `${process.env.NOBBLET_BASE_URL}/payouts/quotes/${quoteId}`,
          {
            headers: {
              Authorization: `Bearer ${process.env.NOBBLET_SECRET_KEY}`,
            },
          },
        ),
      );
      return response.data;
    } catch (error) {
      throw new BadRequestException(error.response.data);
    }
  }

  async getQuoteByReference(reference: string) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(
          `${process.env.NOBBLET_BASE_URL}/payouts/fetch/reference/${reference}`,
          {
            headers: {
              Authorization: `Bearer ${process.env.NOBBLET_SECRET_KEY}`,
            },
          },
        ),
      );
      return response.data;
    } catch (error) {
      throw new BadRequestException(error.response.data);
    }
  }

  async getQuoteById(id: string) {
    try {
      const response = await firstValueFrom(
        this.httpService.get(
          `${process.env.NOBBLET_BASE_URL}/payouts/fetch/${id}`,
          {
            headers: {
              Authorization: `Bearer ${process.env.NOBBLET_SECRET_KEY}`,
            },
          },
        ),
      );
      return response.data;
    } catch (error) {
      throw new BadRequestException(error.response.data);
    }
  }

  async getOfframpsQuote(createPayoutQuoteDto: CreatePayoutQuoteDto) {
    try {
      const response = await firstValueFrom(
        this.httpService.post(
          `${process.env.NOBBLET_BASE_URL}/payouts/quotes`,
          createPayoutQuoteDto,
          {
            headers: {
              Authorization: `Bearer ${process.env.NOBBLET_SECRET_KEY}`,
            },
          },
        ),
      );
      const res = response.data;
      return res;
    } catch (error) {
      console.log(error.response.data);
      throw new BadRequestException(error.response.data);
    }
  }

  async initializeOfframpsQuote(
    initializePayoutQuoteDto: InitializePayoutQuoteDto,
  ) {
    try {
      const response = await firstValueFrom(
        this.httpService.post(
          `${process.env.NOBBLET_BASE_URL}/payouts/initialize`,
          initializePayoutQuoteDto,
          {
            headers: {
              Authorization: `Bearer ${process.env.NOBBLET_SECRET_KEY}`,
            },
          },
        ),
      );
      return response.data;
    } catch (error) {
      console.log(error.response.data);
      throw new BadRequestException(error.response.data);
    }
  }

  async finalizeOfframpsQuote(quoteId: string) {
    try {
      const response = await firstValueFrom(
        this.httpService.post(
          `${process.env.NOBBLET_BASE_URL}/payouts/finalize`,
          { quoteId },
          {
            headers: {
              Authorization: `Bearer ${process.env.NOBBLET_SECRET_KEY}`,
            },
          },
        ),
      );
      return response.data;
    } catch (error) {
      throw new BadRequestException(error.response.data);
    }
  }

  async sendUSDTToWallet(payoutDto: PayoutDto) {
    try {
      const response = await firstValueFrom(
        this.httpService.post(
          `${process.env.NOBBLET_BASE_URL}/payouts/simulate-address-deposit`,
          payoutDto,
          {
            headers: {
              Authorization: `Bearer ${process.env.NOBBLET_SECRET_KEY}`,
            },
          },
        ),
      );
      return response.data;
    } catch (error) {
      throw new InternalServerErrorException('Failed to send USDT to wallet');
    }
  }

  async createSingleTransaction(singleTransactionDto: SingleTransactionDto) {
    try {
      // Set fixed values
      const source = 'onchain';
      const fromAsset = 'usdt';
      const chain = 'trc20';

      const amount = singleTransactionDto.amount;
      const toCurrency = singleTransactionDto.toCurrency;
      const country = singleTransactionDto.country;
      const beneficiary = singleTransactionDto.beneficiary;
      const paymentReason = singleTransactionDto.paymentReason;
      const clientMetaData = {};

      const { data: createQuoteResponse } = await this.getOfframpsQuote({
        source,
        fromAsset,
        toCurrency,
        chain,
        amount,
      });

      const { data: initializeQuoteResponse } =
        await this.initializeOfframpsQuote({
          quoteId: createQuoteResponse.quoteId,
          customerId: this.generateRandomString(10),
          country: this.sanitizeCountryName(country),
          reference: this.generateRandomString(10),
          beneficiary,
          paymentReason,
          callbackUrl: 'https://example.com/callback',
          clientMetaData,
        });

      const walletAddress = initializeQuoteResponse.address;
      const quoteId = initializeQuoteResponse.quoteId;
      const centAmount = initializeQuoteResponse.amount * 100;

      const { data: finalizeQuoteResponse } =
        await this.finalizeOfframpsQuote(quoteId);

      await this.sendUSDTToWallet({
        address: walletAddress,
        amount: centAmount,
      });

      const { data: getQuoteResponse } = await this.getQuoteByQuoteId(quoteId);

      return {
        quoteId,
        status: getQuoteResponse.status,
        paymentETA: finalizeQuoteResponse.paymentETA,
        reference: finalizeQuoteResponse.reference,
      };
    } catch (error) {
      throw new BadRequestException(error.response.data);
    }
  }

  generateRandomString(length: number) {
    return Math.random()
      .toString(36)
      .substring(2, length + 2);
  }
  sanitizeCountryName(country: string): string {
    const countryMap: Record<string, string> = {
      nigeria: 'NG',
      australia: 'AU',
      kenya: 'KE',
    };
    return countryMap[country.toLowerCase()] || country;
  }
}
