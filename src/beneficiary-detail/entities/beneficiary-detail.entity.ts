import { UserEntity } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('beneficiary_details')
export class BeneficiaryDetailEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  userId: string;

  @ManyToOne(() => UserEntity, (user) => user.beneficiaryDetails)
  @JoinColumn({ name: 'userId' })
  user: UserEntity;

  @Column()
  bankName: string;

  @Column({ default: false })
  isMobileMoney: boolean;

  @Column()
  network: string;

  @Column({ unique: true })
  accountNumber: string;

  @Column()
  accountName: string;

  @Column()
  bankCode: string;

  @Column()
  country: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
