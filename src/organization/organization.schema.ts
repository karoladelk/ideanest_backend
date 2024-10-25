import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

class OrganizationMember {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  email: string;

  @Prop({ default: 'read' }) // Default access level
  access_level: string;
}

@Schema()
export class Organization extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true }) // Store the owner's email
  ownerEmail: string;

  @Prop([{ type: OrganizationMember }]) // Array of members with schema
  members: OrganizationMember[];
}

export const OrganizationSchema = SchemaFactory.createForClass(Organization);
