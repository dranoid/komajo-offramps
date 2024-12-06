import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { WalletEntity } from './entities/wallet.entity';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { WalletType } from './dto/wallet.enum';
import { DepositDto } from './dto/deposit.dto';
import { WithdrawDto } from './dto/withdraw.dto';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { BeneficiaryDetailEntity } from 'src/beneficiary-detail/entities/beneficiary-detail.entity';
import { checkIfEmptyObject } from 'src/Utils';

@Injectable()
export class WalletService {
  constructor(
    private readonly walletRepository: Repository<WalletEntity>,
    private readonly httpService: HttpService,
    private readonly beneficiaryRepository: Repository<BeneficiaryDetailEntity>,
  ) {}

  async getWallets(userId: string, isAdmin: boolean) {
    if (isAdmin) {
      return this.walletRepository.find();
    }
    return this.walletRepository.find({ where: { userId } });
  }

  async getWallet(id: string, userId: string, isAdmin: boolean) {
    let wallet;
    if (isAdmin) {
      wallet = await this.walletRepository.findOneBy({ id });
    }
    wallet = await this.walletRepository.findOneBy({ id, userId });

    if (!wallet) {
      throw new NotFoundException('Wallet not found');
    }
    return wallet;
  }

  async getWalletByCurrency(
    currency: WalletType,
    userId: string,
    isAdmin: boolean,
  ) {
    if (isAdmin) {
      return this.walletRepository.findOneBy({ type: currency });
    }
    return this.walletRepository.findOneBy({ type: currency, userId });
  }

  async createWallet(createWalletDto: CreateWalletDto) {
    return this.walletRepository.save(createWalletDto);
  }

  async deposit(id: string, depositDto: DepositDto, userId: string) {
    const wallet = await this.getWallet(id, userId, false);
    wallet.balance += depositDto.amount;
    await this.walletRepository.save(wallet);
    return {
      id: wallet.id,
      balance: wallet.balance,
      userId: wallet.userId,
      type: wallet.type,
    };
  }

  async withdraw(id: string, withdrawDto: WithdrawDto, userId: string) {
    const wallet = await this.getWallet(id, userId, false);

    if (wallet.balance < withdrawDto.amount) {
      throw new BadRequestException('Insufficient balance');
    }

    if (
      !withdrawDto.beneficiaryDetailId &&
      (!withdrawDto.beneficiary ||
        Object.keys(withdrawDto.beneficiary).length === 0)
    ) {
      throw new BadRequestException('Beneficiary is required');
    }

    const countryRequirements = await this.getWithdrawalRequirements(
      withdrawDto.countryCode,
    );

    if (withdrawDto.type === 'bank') {
      if (checkIfEmptyObject(countryRequirements.destination['BANK'])) {
        throw new BadRequestException(
          'Bank withdrawal not supported for this country',
        );
      }
    } else if (withdrawDto.type === 'mobile-money') {
      if (checkIfEmptyObject(countryRequirements.destination['MOBILEMONEY'])) {
        throw new BadRequestException(
          'Mobile money withdrawal not supported for this country',
        );
      }
    }

    const beneficiary = withdrawDto.beneficiaryDetailId
      ? await this.beneficiaryRepository.findOneBy({
          id: withdrawDto.beneficiaryDetailId,
          userId: userId,
        })
      : withdrawDto.beneficiary;

    if (!beneficiary) {
      throw new NotFoundException('Beneficiary not found');
    }

    if (withdrawDto.type === 'mobile-money') {
      if (
        !beneficiary.network ||
        !beneficiary.accountName ||
        !beneficiary.accountNumber
      ) {
        throw new BadRequestException(
          'Network, account name and account number are required for mobile money withdrawals',
        );
      }
    } else if (withdrawDto.type === 'bank') {
      if (!beneficiary.accountNumber || !beneficiary.bankCode) {
        throw new BadRequestException(
          'Account number and bank code are required for bank withdrawals',
        );
      }
    }

    // Get offramps quote
    // Check if its within the threshold
    // Initialize quote with beneficiary details
    // check expiry
    // Finalize quote
    // deduct balance

    // lock balance during transaction

    wallet.balance -= withdrawDto.amount;
    await this.walletRepository.save(wallet);
    return {
      id: wallet.id,
      balance: wallet.balance,
      userId: wallet.userId,
      type: wallet.type,
    };
  }

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
}
