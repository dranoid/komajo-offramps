import { WalletEntity } from 'src/wallet/entities/wallet.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum TransactionType {
  DEPOSIT = 'deposit',
  WITHDRAWAL = 'withdrawal',
}

@Entity('transactions')
export class TransactionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  walletId: string;

  @ManyToOne(() => WalletEntity, (wallet) => wallet.transactions)
  @JoinColumn({ name: 'walletId' })
  wallet: WalletEntity;

  @Column({ nullable: true })
  blockchainAddress: string;

  @Column({ nullable: true })
  offrampsQuoteId: string;

  @Column({
    type: 'enum',
    enum: TransactionType,
  })
  type: TransactionType;

  @Column({ nullable: true, unique: true })
  reference: string;

  @Column({ nullable: true })
  sourceCurrency: string;

  @Column({ nullable: true })
  targetCurrency: string;

  @Column('decimal', { precision: 18, scale: 8, nullable: true })
  sourceAmount: number;

  @Column('decimal', { precision: 18, scale: 8, nullable: true })
  targetAmount: number;

  @Column('decimal', { precision: 10, scale: 4, nullable: true })
  exchangeRate: number;

  @Column('timestamp', { nullable: true })
  quoteExpiresAt: Date;

  @Column({
    type: 'enum',
    enum: ['PENDING_REVIEW', 'PROCESSING', 'COMPLETED', 'FAILED'],
    default: 'PROCESSING',
  })
  status: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column('uuid', { nullable: true })
  offrampsId: string;

  @Column({ nullable: true })
  offrampsStatus: string;
}
