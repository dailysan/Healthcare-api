import { Injectable } from '@nestjs/common';
import { ConfigsService } from './configs.service';

@Injectable()
export class ConfigsSeeder {
  constructor(private readonly configsService: ConfigsService) {}

  async seed() {
    const configs = [
      {
        key: 'saltRounds',
        value: '10',
        description: 'Number of salt rounds for password hashing'
      },
      {
        key: 'jwtSecret',
        value: 'your-secret-key-here',
        description: 'JWT secret for token signing'
      },
      {
        key: 'passwordMinLength',
        value: '8',
        description: 'Minimum password length'
      }
    ];

    for (const config of configs) {
      try {
        await this.configsService.create(config);
      } catch (error) {
        console.log(`Config ${config.key} already exists`);
      }
    }
  }
}
