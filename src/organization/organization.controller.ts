import { Controller, Post, Get, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('organization')
@UseGuards(JwtAuthGuard) // Protect routes with JWT Auth Guard
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}

  @Post()
  async create(@Body() body: { name: string; description: string }) {
    return this.organizationService.create(body.name, body.description);
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    const org = await this.organizationService.findById(id);
    return {
      organization_id: org._id,
      name: org.name,
      description: org.description,
      organization_members: org.members,
    };
  }

  @Get()
  async findAll() {
    const organizations = await this.organizationService.findAll();
    return organizations.map(org => ({
      organization_id: org._id,
      name: org.name,
      description: org.description,
      organization_members: org.members,
    }));
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() body: { name: string; description: string }) {
    return this.organizationService.update(id, body.name, body.description);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.organizationService.delete(id);
  }

  @Post(':id/invite')
  async invite(@Param('id') id: string, @Body() body: { user_email: string }) {
    return this.organizationService.invite(id, body.user_email);
  }
}
