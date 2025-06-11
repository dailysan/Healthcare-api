import { Injectable, BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { Clinic } from './entities/clinic.entity';
import { CreateClinicDto } from './dto/create-clinic.dto';
import { UpdateClinicDto } from './dto/update-clinic.dto';

@Injectable()
export class ClinicsService {
  constructor(
    @InjectRepository(Clinic)
    private readonly clinicsRepository: Repository<Clinic>,
  ) {}

  async create(createClinicDto: CreateClinicDto): Promise<Clinic> {
    if (!createClinicDto.name) {
      throw new BadRequestException('El nombre es requerido');
    }

    const existingClinic = await this.clinicsRepository.findOne({
      where: { name: createClinicDto.name },
    });
    if (existingClinic) {
      throw new ConflictException('Ya existe una clínica con ese nombre');
    }

    const clinic = this.clinicsRepository.create(createClinicDto);
    const savedClinic = await this.clinicsRepository.save(clinic);
    
    if (!savedClinic.id) {
      throw new Error('Failed to create clinic');
    }
    return savedClinic;
  }

  async findAll(): Promise<Clinic[]> {
    return this.clinicsRepository.find();
  }

  async findOne(id: number): Promise<Clinic> {
    const clinic = await this.clinicsRepository.findOneBy({ id });
    if (!clinic) {
      throw new NotFoundException(`Clinic with id ${id} not found`);
    }
    return clinic;
  }

  async update(id: number, updateClinicDto: UpdateClinicDto): Promise<Clinic> {
    if (!id || id <= 0) {
      throw new Error('Invalid clinic ID');
    }

    const clinic = await this.findOne(id);
    
    if (updateClinicDto.name) {
      const trimmedName = updateClinicDto.name.trim();
      if (trimmedName === '') {
        throw new Error('Clinic name cannot be empty');
      }

      const existingClinic = await this.clinicsRepository.findOne({
        where: {
          name: trimmedName,
          id: Not(id)
        }
      });
      if (existingClinic) {
        throw new Error(`Clinic with name ${trimmedName} already exists`);
      }
    }

    await this.clinicsRepository.update(id, updateClinicDto);
    const updatedClinic = await this.findOne(id);
    
    if (!updatedClinic) {
      throw new Error('Failed to update clinic');
    }
    return updatedClinic;
  }

  async remove(id: number): Promise<void> {
    if (!id || id <= 0) {
      throw new Error('Invalid clinic ID');
    }

    const clinic = await this.findOne(id);
    const result = await this.clinicsRepository.delete(id);
    
    if (result.affected === 0) {
      throw new Error('Failed to delete clinic');
    }
  }
}
