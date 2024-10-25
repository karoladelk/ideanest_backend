import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Organization } from './organization.schema';

@Injectable()
export class OrganizationService {
  constructor(
    @InjectModel(Organization.name) private organizationModel: Model<Organization>,
  ) {}

  async create(name: string, description: string) {
    const newOrg = new this.organizationModel({ name, description, members: [] });
    const savedOrg = await newOrg.save();
    return { organization_id: savedOrg._id };
  }

  async findById(id: string) {
    return this.organizationModel.findById(id).exec();
  }

  async findAll() {
    return this.organizationModel.find().exec();
  }

  async update(id: string, name: string, description: string) {
    const updatedOrg = await this.organizationModel.findByIdAndUpdate(
      id,
      { name, description },
      { new: true },
    ).exec();
    return updatedOrg ? { organization_id: updatedOrg._id, name: updatedOrg.name, description: updatedOrg.description } : null;
  }

  async delete(id: string) {
    await this.organizationModel.findByIdAndDelete(id).exec();
    return { message: 'Organization deleted successfully' };
  }

  async invite(id: string, user_email: string) {
    const organization = await this.organizationModel.findById(id);
    if (!organization) throw new Error('Organization not found');

    // Add member with read-only access
    organization.members.push({
      name: user_email.split('@')[0], // Dummy name from email
      email: user_email,
      access_level: 'read',
    });
    await organization.save();

    return { message: 'User invited successfully' };
  }
}
