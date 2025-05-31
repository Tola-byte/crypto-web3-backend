import { Injectable, BadRequestException } from '@nestjs/common';
import { ethers } from 'ethers';
import { TronWeb } from 'tronweb';
import { Keypair } from '@solana/web3.js';
import * as QRCode from 'qrcode';

@Injectable()
export class WalletsService {

  async generate(type: string): Promise<{ address: string; privateKey: string }> {
    switch (type) {
      case 'erc20':
      case 'bep20': {
        const wallet = ethers.Wallet.createRandom();
        return {
          address: wallet.address,
          privateKey: wallet.privateKey,
        };
      }

      case 'trc20': {
        const tronWeb = new TronWeb({
          fullHost: 'https://api.trongrid.io'
        });
        const {address, privateKey} = await tronWeb.createAccount(); 

        // Tola send base58 here, and in the backend just make use of hex, for other transactions.
      //  console.log(address?.base58, privateKey)
        const uiAddress = address?.base58
      //  address?.hex, // backend recognizes this 
        
       //  address?.base58 // display this to frontend.
        return {address: uiAddress, privateKey};
      }

      case 'solana': {
    
        const kp = Keypair.generate();
        const address = kp.publicKey.toBase58();
        const secretKey = Buffer.from(kp.secretKey).toString('hex');
        return { address, privateKey: secretKey };
      }

      default:
        throw new BadRequestException(`Unsupported type: ${type}`);
    }
  }

 
  async generateQrCode(data: string): Promise<string> {
    return QRCode.toDataURL(data);
  }
}
