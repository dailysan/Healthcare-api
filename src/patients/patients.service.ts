import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { Patient } from './entities/patient.entity';
import { CreatePatientDto } from './dto/create-patient.dto';
import { AuditLogService } from '../audit-log/audit-log.service';
import { Invoice } from '../invoices/entities/invoice.entity';

@Injectable()
export class PatientsService {
  constructor(
    @InjectRepository(Patient)
    private readonly patientsRepository: Repository<Patient>,
    @InjectRepository(Invoice)
    private readonly invoicesRepository: Repository<Invoice>,
    private readonly auditLogService: AuditLogService
  ) {}

  async create(createPatientDto: CreatePatientDto): Promise<Patient> {
    if (!createPatientDto.email || !createPatientDto.firstName || !createPatientDto.lastName || !createPatientDto.clinicId) {
      throw new BadRequestException('Email, first name, last name and clinicId are required');
    }

    if (!createPatientDto.email.includes('@')) {
      throw new BadRequestException('Invalid email format');
    }

    if (createPatientDto.firstName.length < 2 || createPatientDto.firstName.length > 100) {
      throw new BadRequestException('First name must be between 2 and 100 characters');
    }
    if (createPatientDto.lastName.length < 2 || createPatientDto.lastName.length > 100) {
      throw new BadRequestException('Last name must be between 2 and 100 characters');
    }

    if (createPatientDto.phone && (createPatientDto.phone.length < 10 || createPatientDto.phone.length > 20)) {
      throw new BadRequestException('Phone number must be between 10 and 20 digits');
    }

    const existingPatient = await this.patientsRepository.findOne({
      where: { email: createPatientDto.email.toLowerCase() }
    });
    if (existingPatient) {
      throw new Error(`Patient with email ${createPatientDto.email} already exists`);
    }

    const patient = this.patientsRepository.create(createPatientDto);
    const savedPatient = await this.patientsRepository.save(patient);
    
    if (!savedPatient.id) {
      throw new Error('Failed to create patient');
    }

    await this.auditLogService.log(
      'CREATE',
      'patients',
      savedPatient.id.toString(),
      { patient: savedPatient },
      'system',
      '127.0.0.1'
    );

    return savedPatient;
  }

  async findAll(): Promise<Patient[]> {
    return this.patientsRepository.find();
  }

  async findOne(id: number): Promise<Patient> {
    const patient = await this.patientsRepository.findOneBy({ id });
    if (!patient) {
      throw new NotFoundException(`Patient with id ${id} not found`);
    }
    return patient;
  }

  async findByEmail(email: string): Promise<Patient> {
    const patient = await this.patientsRepository.findOneBy({ email });
    if (!patient) {
      throw new NotFoundException(`Patient with email ${email} not found`);
    }
    return patient;
  }

  async update(id: number, updatePatientDto: Partial<CreatePatientDto>): Promise<Patient> {
    if (!id || id <= 0) {
      throw new Error('Invalid patient ID');
    }

    const patient = await this.findOne(id);
    if (!patient) {
      throw new NotFoundException(`Patient with id ${id} not found`);
    }

    if (updatePatientDto.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(updatePatientDto.email)) {
        throw new Error('Invalid email format');
      }

      const existingPatient = await this.patientsRepository.findOne({
        where: {
          email: updatePatientDto.email.toLowerCase(),
          id: Not(id)
        }
      });
      if (existingPatient) {
        throw new Error(`Patient with email ${updatePatientDto.email} already exists`);
      }
    }

    if (updatePatientDto.firstName) {
      if (updatePatientDto.firstName.length < 2 || updatePatientDto.firstName.length > 100) {
        throw new Error('First name must be between 2 and 100 characters');
      }
    }

    if (updatePatientDto.lastName) {
      if (updatePatientDto.lastName.length < 2 || updatePatientDto.lastName.length > 100) {
        throw new Error('Last name must be between 2 and 100 characters');
      }
    }

    if (updatePatientDto.phone) {
      const phoneRegex = /^[0-9]{10,20}$/;
      if (!phoneRegex.test(updatePatientDto.phone)) {
        throw new Error('Invalid phone number format');
      }
    }

    await this.patientsRepository.update(id, updatePatientDto);
    const updatedPatient = await this.findOne(id);
    
    if (!updatedPatient) {
      throw new Error('Failed to update patient');
    }

    try {
      await this.auditLogService.log(
        'UPDATE',
        'patients',
        id.toString(),
        { old: patient, new: updatedPatient },
        'system',
        '127.0.0.1'
      );
    } catch (error) {
      console.error('Error logging audit:', error);
    }

    return updatedPatient;
  }

  async remove(id: number): Promise<void> {
    if (!id || id <= 0) {
      throw new Error('Invalid patient ID');
    }

    const patient = await this.findOne(id);
    if (!patient) {
      throw new NotFoundException(`Patient with id ${id} not found`);
    }

    const invoices = await this.invoicesRepository.find({
      where: { patient: { id } }
    });
    if (invoices && invoices.length > 0) {
      throw new BadRequestException('Cannot delete patient with associated invoices');
    }

    await this.auditLogService.log(
      'DELETE',
      'PATIENTS',
      id.toString(),
      { patient },
      'system',
      '127.0.0.1'
    );

    const result = await this.patientsRepository.delete(id);
    
    if (result.affected === 0) {
      throw new Error('Failed to delete patient');
    }
  }
}
