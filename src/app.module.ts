import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module'; 
import { OrganizationModule } from './organization/organization.module'; 

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URI),
    AuthModule,
    OrganizationModule,
  ],
})
export class AppModule {}



