import { Verification } from 'src/modules/verification/domain/verification';
import { VerificationRepository } from '../../verification.repository';
import { VerificationMapper } from '../mapper/verification.mapper';
import { VerificationSchemaClass } from '../entities/verification.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { NullableType } from 'src/utils/types/nullable.type';

@Injectable()
export class VerificationDocumentRepository implements VerificationRepository {
  constructor(
    @InjectModel(VerificationSchemaClass.name)
    private readonly verificationModel: Model<VerificationSchemaClass>,
  ) {}

  async create(data: Verification): Promise<Verification> {
    const persistenceModel = VerificationMapper.toPersistence(data);
    const createVerification = new this.verificationModel(persistenceModel);
    const verificationObject = await createVerification.save();
    return VerificationMapper.toDomain(verificationObject);
  }
  async update(
    id: Verification['id'],
    data: Partial<Omit<Verification, 'id' | 'createdAt' | 'updatedAt'>>,
  ): Promise<Verification> {
    const verificationObject = await this.verificationModel.findByIdAndUpdate(
      id,
      data,
      { new: true },
    );

    if (!verificationObject) {
      throw new Error('Verification not found');
    }

    return VerificationMapper.toDomain(verificationObject);
  }

  async findById(id: Verification['id']): Promise<NullableType<Verification>> {
    if (!id) return null;

    const verificationObject = await this.verificationModel.findById(id);

    return verificationObject
      ? VerificationMapper.toDomain(verificationObject)
      : null;
  }

  async findByUserId(
    userId: Verification['userId'],
  ): Promise<NullableType<Verification>> {
    if (!userId) return null;

    const verificationObject = await this.verificationModel.findOne({ userId });

    return verificationObject
      ? VerificationMapper.toDomain(verificationObject)
      : null;
  }

  async deleteById(id: Verification['id']): Promise<any> {
    return this.verificationModel.deleteOne({ _id: id });
  }
}
