import { Injectable, BadRequestException, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OhipCode } from './entities/ohip-code.entity';
import { CreateOhipCodeDto } from './dto/create-ohip-code.dto';

@Injectable()
export class OhipService {
  constructor(
    @InjectRepository(OhipCode)
    private ohipCodesRepository: Repository<OhipCode>,
  ) {}

  async create(createOhipCodeDto: CreateOhipCodeDto): Promise<OhipCode> {
    const existingCode = await this.ohipCodesRepository.findOne({
      where: { code: createOhipCodeDto.code },
    });
    if (existingCode) {
      throw new BadRequestException('El código OHIP ya existe');
    }

    const ohipCode = this.ohipCodesRepository.create(createOhipCodeDto);
    const savedCode = await this.ohipCodesRepository.save(ohipCode);
    
    if (!savedCode.id) {
      throw new Error('Failed to create OHIP code');
    }

    return savedCode;
  }

  async findAll(): Promise<OhipCode[]> {
    const ohipCodes = await this.ohipCodesRepository.find();
    if (!ohipCodes || ohipCodes.length === 0) {
      throw new NotFoundException('No OHIP codes found');
    }
    return ohipCodes;
  }

  async findOne(id: number): Promise<OhipCode | null> {
    const ohipCode = await this.ohipCodesRepository.findOneBy({ id });
    return ohipCode;
  }

  async findByCode(code: string): Promise<OhipCode | null> {
    const ohipCode = await this.ohipCodesRepository.findOneBy({ code });
    if (!ohipCode) {
      return null;
    }
    return ohipCode;
  }

  async findByActive(): Promise<OhipCode[]> {
    const activeCodes = await this.ohipCodesRepository.find({ where: { isActive: true } });
    if (!activeCodes || activeCodes.length === 0) {
      throw new NotFoundException('No active OHIP codes found');
    }
    return activeCodes;
  }

  async update(id: number, updateOhipCodeDto: Partial<CreateOhipCodeDto>): Promise<OhipCode> {
    const ohipCode = await this.findOne(id);
    if (!ohipCode) {
      throw new NotFoundException(`OHIP code with id ${id} not found`);
    }

    await this.ohipCodesRepository.update(id, updateOhipCodeDto);
    const updatedCode = await this.findOne(id);
    if (!updatedCode) {
      throw new Error(`Failed to update OHIP code with id ${id}`);
    }
    return updatedCode;
  }

  async remove(id: number): Promise<void> {
    const result = await this.ohipCodesRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`OHIP code with id ${id} not found`);
    }
  }

  async validatePrice(code: string, price: number): Promise<boolean> {
    const ohipCode = await this.findByCode(code);
    if (!ohipCode) {
      throw new NotFoundException(`OHIP code ${code} not found`);
    }

    if (!ohipCode.isActive) {
      throw new NotFoundException(`OHIP code ${code} is not active`);
    }

    if (price < ohipCode.basePrice) {
      throw new Error(`Price ${price} cannot be lower than base price ${ohipCode.basePrice}`);
    }

    if (ohipCode.maxPrice && price > ohipCode.maxPrice) {
      throw new Error(`Price ${price} cannot exceed maximum price ${ohipCode.maxPrice}`);
    }

    return true;
  }
}