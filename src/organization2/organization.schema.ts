import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Organization extends Document {
  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;
}

export const OrganizationSchema = SchemaFactory.createForClass(Organization);
