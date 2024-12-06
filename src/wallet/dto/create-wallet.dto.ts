import { IsString, IsNotEmpty, IsEnum } from 'class-validator';
import { WalletType } from './wallet.enum';

export class CreateWalletDto {
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsEnum(WalletType)
  @IsNotEmpty()
  type: WalletType;
}
