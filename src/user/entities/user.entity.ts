import { WalletEntity } from 'src/wallet/entities/wallet.entity';
import { RolesEnum } from '../../auth/dto/roles.enum';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { BeneficiaryDetailEntity } from 'src/beneficiary-detail/entities/beneficiary-detail.entity';
import { TransactionEntity } from 'src/transaction/entities/transaction.entity';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: RolesEnum })
  roles: RolesEnum[];

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => WalletEntity, (wallet) => wallet.user)
  wallets: WalletEntity[];

  @OneToMany(() => BeneficiaryDetailEntity, (beneficiary) => beneficiary.user)
  beneficiaryDetails: BeneficiaryDetailEntity[];

  @OneToMany(() => TransactionEntity, (transaction) => transaction.user)
  transactions: TransactionEntity[];
}
