import { Controller, Post, Get, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GetUser } from '../auth/get-user.decorator'; // Custom decorator to extract user info

@Controller('organization')
@UseGuards(JwtAuthGuard) // Protect routes with JWT Auth Guard
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}

  @Post()
  async create(@GetUser() user: { email: string }, @Body() body: { name: string; description: string }) {
    return this.organizationService.create(user.email, body.name, body.description);
  }

  @Get(':id')
  async findById(@Param('id') id: string, @GetUser() user: { email: string }) {
    return this.organizationService.findById(id, user.email);
  }

  @Get()
  async findAll(@GetUser() user: { email: string }) {
    return this.organizationService.findAll(user.email);
  }

  @Put(':id')
  async update(@Param('id') id: string, @GetUser() user: { email: string }, @Body() body: { name: string; description: string }) {
    return this.organizationService.update(id, user.email, body.name, body.description);
  }

  @Delete(':id')
  async delete(@Param('id') id: string, @GetUser() user: { email: string }) {
    return this.organizationService.delete(id, user.email);
  }

  @Post(':id/invite')
  async invite(@Param('id') id: string, @GetUser() user: { email: string }, @Body() body: { user_email: string }) {
    return this.organizationService.invite(id, user.email, body.user_email);
  }
}
