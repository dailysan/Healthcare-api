import { Module, OnModuleInit } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigsService } from './configs.service';
import { Config, ConfigSchema } from './entities/config.entity';
import { ConfigsSeeder } from './configs.seeder';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Config.name, schema: ConfigSchema }])
  ],
  providers: [ConfigsService, ConfigsSeeder],
  exports: [ConfigsService]
})
export class ConfigsModule implements OnModuleInit {
  constructor(
    private readonly configsSeeder: ConfigsSeeder
  ) {}

  async onModuleInit() {
    await this.configsSeeder.seed();
  }
}
