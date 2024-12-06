import { OfframpTransactionEntity } from 'src/offramp-transaction/entities/offramp-transaction.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('alerts')
export class AlertEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  offrampTransactionId: string;

  @OneToOne(
    () => OfframpTransactionEntity,
    (offrampTransaction) => offrampTransaction.alert,
  )
  @JoinColumn({ name: 'offrampTransactionId' })
  offrampTransaction: OfframpTransactionEntity;

  @Column({
    type: 'enum',
    enum: ['RATE_THRESHOLD_EXCEEDED'],
  })
  type: string;

  @Column({
    type: 'enum',
    enum: ['PENDING_REVIEW', 'APPROVED', 'REJECTED'],
  })
  status: string;

  @Column({ type: 'timestamp', nullable: true })
  reviewedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
