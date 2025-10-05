import { VerificationRepository } from './infrastructure/verification.repository';
import { Injectable } from '@nestjs/common';
import { Verification } from './domain/verification';
import { NullableType } from 'src/utils/types/nullable.type';
import bcrypt from 'bcryptjs';

@Injectable()
export class VerificationService {
  constructor(
    private readonly verificationRepository: VerificationRepository,
  ) {}
  async create(
    data: Omit<Verification, 'id' | 'createdAt' | 'updatedAt'>,
  ): Promise<Verification> {
    const salt = await bcrypt.genSalt();

    const hash = await bcrypt.hash(data.token, salt);

    data.token = hash;

    return await this.verificationRepository.create(data);
  }

  async update(
    id: Verification['id'],
    data: Partial<Omit<Verification, 'id' | 'createdAt' | 'updatedAt'>>,
  ): Promise<Verification> {
    if (data.token) {
      const salt = await bcrypt.genSalt();

      const hash = await bcrypt.hash(data.token, salt);

      data.token = hash;
    }

    return await this.verificationRepository.update(id, data);
  }

  async findById(
    id: Verification['id'],
  ): Promise<NullableType<Verification>> {
    return await this.verificationRepository.findById(id);
  }

  async findByUserId(
    id: Verification['userId'],
  ): Promise<NullableType<Verification>> {
    return await this.verificationRepository.findByUserId(id);
  }

  async deleteById(id: Verification['id']) {
    return this.verificationRepository.deleteById(id);
  }
}
