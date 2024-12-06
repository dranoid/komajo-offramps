import { AlertEntity } from 'src/alert/entities/alert.entity';
import { TransactionEntity } from 'src/transaction/entities/transaction.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('offramp_transactions')
export class OfframpTransactionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  transactionId: string;

  @OneToOne(() => TransactionEntity)
  @JoinColumn({ name: 'transactionId' })
  transaction: TransactionEntity;

  @OneToOne(() => AlertEntity, (alert) => alert.offrampTransaction)
  alert: AlertEntity;

  @Column()
  offrampsQuoteId: string;

  @Column()
  sourceCurrency: string;

  @Column()
  targetCurrency: string;

  @Column('decimal', { precision: 18, scale: 8 })
  sourceAmount: number;

  @Column('decimal', { precision: 18, scale: 8 })
  targetAmount: number;

  @Column('decimal', { precision: 10, scale: 4 })
  exchangeRate: number;

  @Column('timestamp')
  quoteExpiresAt: Date;

  @Column()
  status: string;

  @Column({ nullable: true })
  blockchainAddress: string;

  @Column({ nullable: true })
  txHash: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
