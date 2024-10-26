import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

class OrganizationMember {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  email: string;

  @Prop({ default: 'read' }) 
  access_level: string;
}

@Schema()
export class Organization extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true }) 
  ownerEmail: string;

  @Prop([{ type: OrganizationMember }])
  members: OrganizationMember[];
}

export const OrganizationSchema = SchemaFactory.createForClass(Organization);
