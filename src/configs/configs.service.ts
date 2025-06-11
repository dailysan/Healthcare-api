import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Config, ConfigDocument } from './entities/config.entity';

@Injectable()
export class ConfigsService {
  constructor(
    @InjectModel(Config.name) private readonly configModel: Model<ConfigDocument>,
  ) {}

  async findAll(): Promise<Config[]> {
    const configs = await this.configModel.find().exec();
    return configs;
  }

  async findOne(key: string): Promise<Config> {
    const config = await this.configModel.findOne({ key }).exec();
    if (!config) {
      throw new NotFoundException(`Config with key ${key} not found`);
    }
    return config;
  }

  async create(createConfigDto: any): Promise<Config> {
    const config = new this.configModel(createConfigDto);
    return config.save();
  }

  async update(key: string, updateConfigDto: any): Promise<Config> {
    const config = await this.configModel.findOneAndUpdate(
      { key },
      updateConfigDto,
      { new: true }
    ).exec();
    if (!config) {
      throw new NotFoundException(`Config with key ${key} not found`);
    }
    return config;
  }

  async remove(key: string): Promise<void> {
    const result = await this.configModel.findOneAndDelete({ key }).exec();
    if (!result) {
      throw new NotFoundException(`Config with key ${key} not found`);
    }
  }
}
