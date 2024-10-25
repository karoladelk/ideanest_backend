import { Controller, Post, Get, Put, Delete, Param, Body } from '@nestjs/common';
import { OrganizationService } from './organization.service';

@Controller('organization')
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}

  @Post()
  async createOrganization(@Body('name') name: string, @Body('description') description: string) {
    return this.organizationService.createOrganization(name, description);
  }

  @Get(':id')
  async getOrganization(@Param('id') id: string) {
    return this.organizationService.getOrganizationById(id);
  }

  @Put(':id')
  async updateOrganization(@Param('id') id: string, @Body('name') name: string, @Body('description') description: string) {
    return this.organizationService.updateOrganization(id, name, description);
  }

  @Delete(':id')
  async deleteOrganization(@Param('id') id: string) {
    return this.organizationService.deleteOrganization(id);
  }
}
