import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Organization } from './organization.schema';

@Injectable()
export class OrganizationService {
  constructor(
    @InjectModel(Organization.name) private orgModel: Model<Organization>,
  ) {}

  async createOrganization(name: string, description: string) {
    const newOrg = new this.orgModel({ name, description });
    return newOrg.save();
  }

  async getOrganizationById(id: string) {
    return this.orgModel.findById(id).exec();
  }

  async updateOrganization(id: string, name: string, description: string) {
    return this.orgModel.findByIdAndUpdate(id, { name, description }, { new: true }).exec();
  }

  async deleteOrganization(id: string) {
    return this.orgModel.findByIdAndDelete(id).exec();
  }
}
