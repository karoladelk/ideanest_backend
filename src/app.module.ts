import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';  // Adjust path if necessary
import { OrganizationModule } from './organization/organization.module';  // Adjust path if necessary

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGO_URI),  // Make sure MONGO_URI is correctly set in .env
    AuthModule,
    OrganizationModule,
  ],
})
export class AppModule {}


