import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

export default async function handler(req, res) {
  try {
    const app = await NestFactory.create(AppModule);
    app.enableCors(); 

    await app.init();

    const response = await app.getHttpAdapter().getInstance().handle(req, res);
    return response;
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}
