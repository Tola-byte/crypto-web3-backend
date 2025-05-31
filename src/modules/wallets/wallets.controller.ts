import { Controller, Get, Query } from '@nestjs/common';
import { WalletsService } from './wallets.service';
import { GenerateWalletDto } from './dto/generate-wallet.dto';

@Controller('wallets')
export class WalletsController {
  constructor(private readonly walletsService: WalletsService) {}

  @Get()
  async generate(
    @Query() { type }: GenerateWalletDto,
  ): Promise<{ address: string; privateKey: string; qrCode: string }> {
    const { address, privateKey } = await this.walletsService.generate(type);
    const qrCode = await this.walletsService.generateQrCode(address);
    return { address, privateKey, qrCode };
  }
}
