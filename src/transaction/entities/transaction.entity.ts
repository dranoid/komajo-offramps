import { BeneficiaryDetailEntity } from 'src/beneficiary-detail/entities/beneficiary-detail.entity';
import { OfframpTransactionEntity } from 'src/offramp-transaction/entities/offramp-transaction.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import { WalletEntity } from 'src/wallet/entities/wallet.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('transactions')
export class TransactionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  userId: string;

  @ManyToOne(() => UserEntity, (user) => user.transactions)
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  @Column('uuid')
  walletId: string;

  @ManyToOne(() => WalletEntity, (wallet) => wallet.transactions)
  @JoinColumn({ name: 'walletId' })
  wallet: WalletEntity;

  @Column({
    type: 'enum',
    enum: ['WITHDRAWAL', 'DEPOSIT'],
  })
  type: string;

  @Column('decimal', { precision: 18, scale: 8 })
  amount: number;

  @Column('uuid', { nullable: true })
  beneficiaryId: string;

  @ManyToOne(() => BeneficiaryDetailEntity)
  @JoinColumn({ name: 'beneficiaryId' })
  beneficiary: BeneficiaryDetailEntity;

  @Column('uuid', { nullable: true })
  offrampTransactionId: string;

  @Column({
    type: 'enum',
    enum: ['PENDING', 'PROCESSING', 'COMPLETED', 'FAILED'],
  })
  status: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToOne(() => OfframpTransactionEntity)
  @JoinColumn({ name: 'offrampTransactionId' })
  offrampTransaction: OfframpTransactionEntity;
}
