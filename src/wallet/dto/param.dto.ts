import { IsEnum } from 'class-validator';
import { Transform } from 'class-transformer';
import { WalletType } from './wallet.enum';

export class CurrencyParamDto {
  @Transform(({ value }) => value.toUpperCase())
  @IsEnum(WalletType, { message: 'Invalid currency type' })
  currency: WalletType;
}
