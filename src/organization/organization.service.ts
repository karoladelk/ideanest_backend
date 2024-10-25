import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Organization } from './organization.schema';

@Injectable()
export class OrganizationService {
  constructor(
    @InjectModel(Organization.name) private organizationModel: Model<Organization>,
  ) {}

  async create(ownerEmail: string, name: string, description: string) {
    const newOrg = new this.organizationModel({ name, description, ownerEmail, members: [{ email: ownerEmail, access_level: 'owner' }] });
    const savedOrg = await newOrg.save();
    return { organization_id: savedOrg._id };
  }

  async findById(id: string, userEmail: string) {
    const org = await this.organizationModel.findById(id).exec();
    if (!org) throw new NotFoundException('Organization not found');

    const isOwner = org.ownerEmail === userEmail;
    const isMember = org.members.some(member => member.email === userEmail);

    if (!isOwner && !isMember) throw new ForbiddenException('Access denied: Not a member of this organization');

    return {
      organization_id: org._id,
      name: org.name,
      description: org.description,
      organization_members: org.members,
    };
  }

  async findAll(userEmail: string) {
    const organizations = await this.organizationModel.find().exec();
    return organizations.filter(org => {
      const isOwner = org.ownerEmail === userEmail;
      const isMember = org.members.some(member => member.email === userEmail);
      return isOwner || isMember;
    }).map(org => ({
      organization_id: org._id,
      name: org.name,
      description: org.description,
      organization_members: org.members,
    }));
  }

  async update(id: string, userEmail: string, name: string, description: string) {
    const org = await this.organizationModel.findById(id).exec();
    if (!org) throw new NotFoundException('Organization not found');

    // Check if the user is the owner
    const isOwner = org.members[0].email === userEmail; // Assuming the first member is the owner
    if (!isOwner) throw new ForbiddenException('Access denied: Only the owner can update the organization');

    // Update organization while keeping members intact
    org.name = name;
    org.description = description;

    const updatedOrg = await org.save(); // Save the updated organization

    return {
        organization_id: updatedOrg._id,
        name: updatedOrg.name,
        description: updatedOrg.description,
        members: updatedOrg.members, // Include members in the response if necessary
    };
  }


  async delete(id: string, userEmail: string) {
    const org = await this.organizationModel.findById(id).exec();
    if (!org) throw new NotFoundException('Organization not found');

    const isOwner = org.ownerEmail === userEmail;
    if (!isOwner) throw new ForbiddenException('Access denied: Only the owner can delete the organization');

    await this.organizationModel.findByIdAndDelete(id).exec();
    return { message: 'Organization deleted successfully' };
  }

  async invite(id: string, userEmail: string, newUserEmail: string) {
    const organization = await this.organizationModel.findById(id);
    if (!organization) throw new NotFoundException('Organization not found');

    const isOwner = organization.ownerEmail === userEmail;
    if (!isOwner) throw new ForbiddenException('Access denied: Only the owner can invite new members');

    organization.members.push({
      name: newUserEmail.split('@')[0], // Dummy name from email
      email: newUserEmail,
      access_level: 'read', // Read-only access for invited users
    });
    await organization.save();

    return { message: 'User invited successfully' };
  }
}
