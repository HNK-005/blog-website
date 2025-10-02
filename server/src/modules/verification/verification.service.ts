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
    // Do not remove comment below.
    // <creating-property />

    const salt = await bcrypt.genSalt();

    const hash = await bcrypt.hash(data.token, salt);

    data.token = hash;

    return await this.verificationRepository.create(data);
  }

  async findByUserId(
    id: Verification['userId'],
  ): Promise<NullableType<Verification>> {
    // Do not remove comment below.
    // <find-property />
    return await this.verificationRepository.findByUserId(id);
  }

  async deleteById(id: Verification['id']) {
    // Do not remove comment below.
    // <delete-property />
    return this.verificationRepository.deleteById(id);
  }
}
