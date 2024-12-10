export class WithdrawDto {
  amount: number;
  beneficiaryDetailId?: string;
  countryCode: string;
  currency: string;
  type: 'bank' | 'mobile-money';
  paymentReason: string;
  beneficiary?: {
    accountNumber: string;
    accountName: string;
    bankCode: string;
    network?: string;
  };
}
