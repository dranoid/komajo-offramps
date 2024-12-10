import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class WalletService {
  constructor(private readonly httpService: HttpService) {}

  // async getWallets(userId: string, isAdmin: boolean) {
  //   if (isAdmin) {
  //     return this.walletRepository.find();
  //   }
  //   return this.walletRepository.find({ where: { userId } });
  // }

  // async getWallet(id: string, userId: string, isAdmin: boolean) {
  //   let wallet;
  //   if (isAdmin) {
  //     wallet = await this.walletRepository.findOneBy({ id });
  //   }
  //   wallet = await this.walletRepository.findOneBy({ id, userId });

  //   if (!wallet) {
  //     throw new NotFoundException('Wallet not found');
  //   }
  //   return wallet;
  // }

  // async getWalletByCurrency(
  //   currency: WalletType,
  //   userId: string,
  //   isAdmin: boolean,
  // ) {
  //   if (isAdmin) {
  //     return this.walletRepository.findOneBy({ type: currency });
  //   }
  //   return this.walletRepository.findOneBy({ type: currency, userId });
  // }

  // async createWallet(createWalletDto: CreateWalletDto) {
  //   return this.walletRepository.save(createWalletDto);
  // }

  // async deposit(id: string, depositDto: DepositDto, userId: string) {
  //   const wallet = await this.getWallet(id, userId, false);
  //   wallet.balance += depositDto.amount;
  //   await this.walletRepository.save(wallet);
  //   return {
  //     id: wallet.id,
  //     balance: wallet.balance,
  //     userId: wallet.userId,
  //     type: wallet.type,
  //   };
  // }

  // // async initiateWithdraw(id: string, withdrawDto: WithdrawDto, userId: string) {
  // //   const wallet = await this.getWallet(id, userId, false);

  // //   const ongoingTransaction = await this.transactionRepository.findOneBy({
  // //     userId,
  // //     type: TransactionType.WITHDRAWAL,
  // //     status: Not(In(['COMPLETED', 'FAILED'])),
  // //   });

  // //   if (ongoingTransaction) {
  // //     throw new BadRequestException('Withdrawal already in progress');
  // //   }

  // //   if (wallet.balance < withdrawDto.amount) {
  // //     throw new BadRequestException('Insufficient balance');
  // //   }

  // //   if (Object.keys(withdrawDto.beneficiary).length === 0) {
  // //     throw new BadRequestException('Beneficiary is required');
  // //   }

  // //   const countryRequirements = await this.getWithdrawalRequirements(
  // //     withdrawDto.countryCode,
  // //   );

  // //   if (withdrawDto.type === 'bank') {
  // //     if (checkIfEmptyObject(countryRequirements.destination['BANK'])) {
  // //       throw new BadRequestException(
  // //         'Bank withdrawal not supported for this country',
  // //       );
  // //     }
  // //   } else if (withdrawDto.type === 'mobile-money') {
  // //     if (checkIfEmptyObject(countryRequirements.destination['MOBILEMONEY'])) {
  // //       throw new BadRequestException(
  // //         'Mobile money withdrawal not supported for this country',
  // //       );
  // //     }
  // //   }

  // //   let beneficiary: {
  // //     accountNumber: string;
  // //     accountName: string;
  // //     bankCode?: string;
  // //     network?: string;
  // //   };

  // //   beneficiary = withdrawDto.beneficiary;

  // //   if (!beneficiary) {
  // //     throw new NotFoundException('Beneficiary not found');
  // //   }

  // //   if (withdrawDto.type === 'mobile-money') {
  // //     if (
  // //       !beneficiary.network ||
  // //       !beneficiary.accountName ||
  // //       !beneficiary.accountNumber
  // //     ) {
  // //       throw new BadRequestException(
  // //         'Network, account name and account number are required for mobile money withdrawals',
  // //       );
  // //     }
  // //   } else if (withdrawDto.type === 'bank') {
  // //     if (!beneficiary.accountNumber || !beneficiary.bankCode) {
  // //       throw new BadRequestException(
  // //         'Account number and bank code are required for bank withdrawals',
  // //       );
  // //     }
  // //   }

  // //   let chain = wallet.type;
  // //   if (wallet.type === 'USDT') {
  // //     chain = 'TRC20';
  // //   } else if (wallet.type === 'USDC') {
  // //     chain = 'ERC20';
  // //   } else if (wallet.type === 'BTC') {
  // //     chain = 'BTC';
  // //   }

  // //   let transaction = new TransactionEntity();
  // //   transaction.type = TransactionType.WITHDRAWAL;

  // //   const source = process.env.TRANSACTION_SOURCE as 'onchain' | 'offchain';

  // //   // Get offramps quote
  // //   const offrampsQuote = await this.getOfframpsQuote({
  // //     source,
  // //     fromAsset: wallet.type,
  // //     toCurrency: withdrawDto.currency,
  // //     chain,
  // //     amount: withdrawDto.amount,
  // //   });

  // //   transaction.offrampsId = offrampsQuote.id;
  // //   transaction.offrampsQuoteId = offrampsQuote.quoteId;
  // //   transaction.sourceCurrency = wallet.type;
  // //   transaction.targetCurrency = offrampsQuote.settlementCurrency;
  // //   transaction.sourceAmount = offrampsQuote.amount;
  // //   transaction.targetAmount = offrampsQuote.settlementAmount;
  // //   transaction.exchangeRate = offrampsQuote.exchangeRate;
  // //   transaction.quoteExpiresAt = offrampsQuote.expiryTimeStamp;
  // //   transaction.offrampsStatus = offrampsQuote.status;

  // //   transaction = await this.transactionRepository.save(transaction);

  // //   // Initialize quote with beneficiary details
  // //   const initializePayoutDto: InitializePayoutQuoteDto = {
  // //     quoteId: transaction.offrampsQuoteId,
  // //     customerId: userId,
  // //     country: withdrawDto.countryCode,
  // //     reference: `WITHDRAWAL-${transaction.id}`,

  // //     beneficiary: {
  // //       type: withdrawDto.type === 'bank' ? 'BANK' : 'MOBILEMONEY',
  // //       ...(withdrawDto.type === 'bank'
  // //         ? {
  // //             bankCode: beneficiary.bankCode,
  // //             accountNumber: beneficiary.accountNumber,
  // //           }
  // //         : {
  // //             accountName: beneficiary.accountName,
  // //             accountNumber: beneficiary.accountNumber,
  // //             network: beneficiary.network,
  // //           }),
  // //     },

  // //     paymentReason: withdrawDto.paymentReason,
  // //     callbackUrl: `${process.env.BASE_URL}/api/v1/transactions/${transaction.id}/callback`,
  // //     clientMetaData: {
  // //       transactionId: transaction.id,
  // //     },
  // //   };

  // //   const initializedQuote =
  // //     await this.initializeOfframpsQuote(initializePayoutDto);

  // //   transaction.blockchainAddress = initializedQuote.address;
  // //   transaction.offrampsStatus = initializedQuote.status;
  // //   transaction.reference = initializedQuote.reference;

  // //   transaction = await this.transactionRepository.save(transaction);

  // //   // check expiry
  // //   // Finalize quote
  // //   const finalizedQuote = await this.finalizeOfframpsQuote(
  // //     transaction.offrampsQuoteId,
  // //   );

  // //   transaction.offrampsStatus = finalizedQuote.status;

  // //   transaction = await this.transactionRepository.save(transaction);

  // //   if (source === 'onchain') {
  // //     await this.sendUSDTToWallet({
  // //       address: transaction.blockchainAddress,
  // //       amount: transaction.sourceAmount,
  // //     });
  // //   }
  // //   // // deduct balance
  // //   // wallet.balance -= withdrawDto.amount;
  // //   // await this.walletRepository.save(wallet);
  // //   return transaction;
  // // }

  // // async withdrawPhaseII(
  // //   transaction: TransactionEntity,
  // //   withdrawDto: WithdrawDto,
  // //   userId: string,
  // // ) {
  // //   let beneficiary = await this.beneficiaryRepository.findOneBy({
  // //     id: transaction.beneficiaryId,
  // //     userId: userId,
  // //   });

  // //   if (!beneficiary) {
  // //     const existingBeneficiary = await this.beneficiaryRepository.findOneBy({
  // //       accountNumber: beneficiary.accountNumber,
  // //       userId: userId,
  // //     });

  // //     if (!existingBeneficiary) {
  // //       const newBeneficiary = this.beneficiaryRepository.create({
  // //         ...beneficiary,
  // //         userId: userId,
  // //       });
  // //       beneficiary = await this.beneficiaryRepository.save(newBeneficiary);
  // //     }
  // //   }

  // //   // Initialize quote with beneficiary details

  // //   const initializePayoutDto: InitializePayoutQuoteDto = {
  // //     quoteId: transaction.offrampsQuoteId,
  // //     customerId: userId,
  // //     country: withdrawDto.countryCode,
  // //     reference: `WITHDRAWAL-${transaction.id}`,
  // //     ...('offRampsBeneficiaryId' in beneficiary
  // //       ? {
  // //           beneficiaryId: (beneficiary as BeneficiaryDetailEntity)
  // //             .offRampsBeneficiaryId,
  // //         }
  // //       : {
  // //           beneficiary: {
  // //             type: withdrawDto.type === 'bank' ? 'BANK' : 'MOBILEMONEY',
  // //             ...(withdrawDto.type === 'bank'
  // //               ? {
  // //                   bankCode: beneficiary.bankCode,
  // //                   accountNumber: beneficiary.accountNumber,
  // //                 }
  // //               : {
  // //                   accountName: beneficiary.accountName,
  // //                   accountNumber: beneficiary.accountNumber,
  // //                   network: beneficiary.network,
  // //                 }),
  // //           },
  // //         }),
  // //     paymentReason: withdrawDto.paymentReason,
  // //     callbackUrl: `${process.env.BASE_URL}/api/v1/transactions/${transaction.id}/callback`,
  // //     clientMetaData: {
  // //       transactionId: transaction.id,
  // //     },
  // //   };

  // //   const initializedQuote =
  // //     await this.initializeOfframpsQuote(initializePayoutDto);

  // //   transaction.blockchainAddress = initializedQuote.address;
  // //   transaction.offrampsStatus = initializedQuote.status;
  // //   transaction.reference = initializedQuote.reference;

  // //   (beneficiary as BeneficiaryDetailEntity).offRampsBeneficiaryId =
  // //     initializedQuote.beneficiaryDetails.id;
  // //   await this.beneficiaryRepository.save(beneficiary);

  // //   transaction = await this.transactionRepository.save(transaction);

  // //   // check expiry
  // //   // Finalize quote
  // //   const finalizedQuote = await this.finalizeOfframpsQuote(
  // //     transaction.offrampsQuoteId,
  // //   );

  // //   transaction.offrampsStatus = finalizedQuote.status;

  // //   transaction = await this.transactionRepository.save(transaction);

  // //   if (source === 'onchain') {
  // //     await this.sendUSDTToWallet({
  // //       address: transaction.blockchainAddress,
  // //       amount: transaction.sourceAmount,
  // //     });
  // //   }
  // // }

  // // Offramps section
  // async getWithdrawalRequirements(countryCode: string) {
  //   try {
  //     const response = await firstValueFrom(
  //       this.httpService.get(
  //         `${process.env.NOBBLET_BASE_URL}/payouts/supported-countries-requirement/${countryCode}`,
  //         {
  //           headers: {
  //             Authorization: `Bearer ${process.env.NOBBLET_SECRET_KEY}`,
  //           },
  //         },
  //       ),
  //     );
  //     return response.data;
  //   } catch (error) {
  //     throw new BadRequestException(error.response.data);
  //   }
  // }

  // async getRates() {
  //   try {
  //     const response = await firstValueFrom(
  //       this.httpService.get(`${process.env.NOBBLET_BASE_URL}/payouts/limits`),
  //     );
  //     return response.data.map((limit: any) => {
  //       return {
  //         rate: limit.rate,
  //         currency: limit.currency,
  //         country: limit.country,
  //       };
  //     });
  //   } catch (error) {
  //     throw new BadRequestException(error.response.data);
  //   }
  // }

  // async getQuoteByQuoteId(quoteId: string) {
  //   try {
  //     const response = await firstValueFrom(
  //       this.httpService.get(
  //         `${process.env.NOBBLET_BASE_URL}/payouts/quote/${quoteId}`,
  //       ),
  //     );
  //     return response.data;
  //   } catch (error) {
  //     throw new BadRequestException(error.response.data);
  //   }
  // }

  // async getQuoteByReference(reference: string) {
  //   try {
  //     const response = await firstValueFrom(
  //       this.httpService.get(
  //         `${process.env.NOBBLET_BASE_URL}/payouts/fetch/reference/${reference}`,
  //         {
  //           headers: {
  //             Authorization: `Bearer ${process.env.NOBBLET_SECRET_KEY}`,
  //           },
  //         },
  //       ),
  //     );
  //     return response.data;
  //   } catch (error) {
  //     throw new BadRequestException(error.response.data);
  //   }
  // }

  // async getQuoteById(id: string) {
  //   try {
  //     const response = await firstValueFrom(
  //       this.httpService.get(
  //         `${process.env.NOBBLET_BASE_URL}/payouts/fetch/${id}`,
  //         {
  //           headers: {
  //             Authorization: `Bearer ${process.env.NOBBLET_SECRET_KEY}`,
  //           },
  //         },
  //       ),
  //     );
  //     return response.data;
  //   } catch (error) {
  //     throw new BadRequestException(error.response.data);
  //   }
  // }

  // async getOfframpsQuote(createPayoutQuoteDto: CreatePayoutQuoteDto) {
  //   try {
  //     const response = await firstValueFrom(
  //       this.httpService.post(
  //         `${process.env.NOBBLET_BASE_URL}/payouts/quote`,
  //         createPayoutQuoteDto,
  //         {
  //           headers: {
  //             Authorization: `Bearer ${process.env.NOBBLET_SECRET_KEY}`,
  //           },
  //         },
  //       ),
  //     );
  //     const res = response.data;
  //     return res;
  //   } catch (error) {
  //     throw new InternalServerErrorException('Failed to get offramps quote');
  //   }
  // }

  // async initializeOfframpsQuote(initializePayoutDto: InitializePayoutQuoteDto) {
  //   try {
  //     const response = await firstValueFrom(
  //       this.httpService.post(
  //         `${process.env.NOBBLET_BASE_URL}/payouts/initialize`,
  //         initializePayoutDto,
  //         {
  //           headers: {
  //             Authorization: `Bearer ${process.env.NOBBLET_SECRET_KEY}`,
  //           },
  //         },
  //       ),
  //     );
  //     return response.data;
  //   } catch (error) {
  //     throw new InternalServerErrorException(
  //       'Failed to initialize offramps quote',
  //     );
  //   }
  // }

  // async finalizeOfframpsQuote(quoteId: string) {
  //   try {
  //     const response = await firstValueFrom(
  //       this.httpService.post(
  //         `${process.env.NOBBLET_BASE_URL}/payouts/finalize`,
  //         { quoteId },
  //         {
  //           headers: {
  //             Authorization: `Bearer ${process.env.NOBBLET_SECRET_KEY}`,
  //           },
  //         },
  //       ),
  //     );
  //     return response.data;
  //   } catch (error) {
  //     throw new InternalServerErrorException(
  //       'Failed to finalize offramps quote',
  //     );
  //   }
  // }

  // async sendUSDTToWallet(payoutDto: PayoutDto) {
  //   try {
  //     const response = await firstValueFrom(
  //       this.httpService.post(
  //         `${process.env.NOBBLET_BASE_URL}/payouts/simulate-address-deposit`,
  //         payoutDto,
  //         {
  //           headers: {
  //             Authorization: `Bearer ${process.env.NOBBLET_SECRET_KEY}`,
  //           },
  //         },
  //       ),
  //     );
  //     return response.data;
  //   } catch (error) {
  //     throw new InternalServerErrorException('Failed to send USDT to wallet');
  //   }
  // }

  // async isQuoteExpired(transaction: TransactionEntity) {
  //   if (!transaction.quoteExpiresAt) {
  //     return false;
  //   }
  //   const expiryDate = new Date(transaction.quoteExpiresAt);
  //   const currentDate = new Date();
  //   if (currentDate > expiryDate) {
  //     throw new BadRequestException('Quote has expired');
  //   }
  //   return false;
  // }
}
