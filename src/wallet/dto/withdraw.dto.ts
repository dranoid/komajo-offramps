export class WithdrawDto {
  amount: number;
  beneficiaryDetailId?: string;
  countryCode: string;
  type: 'bank' | 'mobile-money';
  beneficiary?: {
    accountNumber: string;
    accountName: string;
    bankCode: string;
    network?: string;
  };
}
