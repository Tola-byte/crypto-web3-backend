import { ConfigService } from '@nestjs/config';
import { myConfigType } from 'src/common/types';

export class TypeConfigService extends ConfigService<myConfigType> {}
