import { IsIn } from 'class-validator';

export class GenerateWalletDto {
  @IsIn(['erc20', 'bep20', 'solana', 'trc20'])
  type: 'erc20' | 'bep20' | 'solana' | 'trc20';
}
